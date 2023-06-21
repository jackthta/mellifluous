import { Route, useParams } from "@tanstack/router";
import Axios from "axios";
import { useEffect, useState } from "react";

import { rootRoute } from "../../router";
import { MusicBrainz, Wikipedia } from "../../utilities/axios";

import Flair from "../../components/flair/Flair";
import ArtistOriginSection from "./components/ArtistOriginSection";
import ArtistSocialsSection from "./components/ArtistSocialsSection";
import ArtistStreamingPlatformsSection from "./components/ArtistStreamingPlatformsSection";
import LatestReleaseSection from "./components/LatestReleaseSection";
import ReleaseSection from "./components/ReleaseSection";

import BaseLayout from "../../layout/base-layout/BaseLayout";

import type { AxiosResponse } from "axios";
import type { Artist_Artist, ReleaseGroup } from "../../types/api/MusicBrainz";
import type { ArtistBiography } from "../../types/api/Wikipedia";

import CSS from "./Artist.module.scss";

export default function Artist() {
  const { artistId, artistName: encodedArtistName } = useParams();
  const [artist, setArtist] = useState<Artist_Artist | null>(null);
  const [artistBiography, setArtistBiography] = useState<string | null>(null);

  const hasAlbums = artist?.["release-groups"].some(
    (release) => release["primary-type"] === "Album"
  );
  const hasEPs = artist?.["release-groups"].some(
    (release) => release["primary-type"] === "EP"
  );
  const hasSingles = artist?.["release-groups"].some(
    (release) => release["primary-type"] === "Single"
  );

  // Fetch artist information
  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    void (async function fetchArtist() {
      try {
        const fetchArtistInfo = MusicBrainz.get<
          null,
          AxiosResponse<Artist_Artist>
        >(`/artist/${artistId}`, {
          params: {
            inc: "genres url-rels releases release-groups",
            status: "official", // Only return official releases (not bootleg, etc)
            type: "album|ep|single",
          },
          signal,
        });

        const decodedArtistName = encodedArtistName
          .split("-")
          .map(function titleCaseNameChunk(nameChunk) {
            return nameChunk.replace(nameChunk[0], nameChunk[0].toUpperCase());
          })
          .join(" ");
        const fetchArtistBiography = Wikipedia.get<
          null,
          AxiosResponse<ArtistBiography>
        >("", {
          params: {
            titles: decodedArtistName,
          },
          signal,
        });

        const resolvedFetches = await Promise.all([
          fetchArtistInfo,
          fetchArtistBiography,
        ]);

        const responsesOk = resolvedFetches.every(
          (response) => response.status >= 200 && response.status <= 299
        );
        if (responsesOk) {
          const [artistInfoResponse, artistBiographyResponse] = resolvedFetches;

          // Loop through release-groups and find matched release to
          // retrieve `id` to link to its album page.
          // Decided to go with release-groups instead of releases
          // since it contains more data we need (genre(s) and type
          // (Album, Single, EP, etc)) and has all the other needed data
          // from a release (title and release date)
          const fetchMissingReleasesPromises = artistInfoResponse.data[
            "release-groups"
          ].map(async (releaseGroup) => {
            // NOTE: using the classic `for` loop because need to potentially `break` out of it
            const releasesLength = artistInfoResponse.data.releases.length;
            for (let i = 0; i < releasesLength; i++) {
              const release = artistInfoResponse.data.releases[i];

              if (releaseGroup.title === release.title) {
                releaseGroup["release-id"] = release.id;
                break;
              }

              // It's possible that the release group's release isn't in
              //  the `releases` array. Need to accommodate this by fetching `release-group`
              // endpoint to find release `id`
              const cantFindRelease = i === releasesLength - 1;
              if (cantFindRelease) {
                return MusicBrainz.get<null, AxiosResponse<ReleaseGroup>>(
                  `/release-group/${releaseGroup.id}`,
                  {
                    params: { inc: "releases" },
                    signal,
                  }
                ).then((response) => {
                  const releaseId = response.data.releases[0].id;
                  releaseGroup["release-id"] = releaseId;
                });
              }
            }
          });

          await Promise.all(fetchMissingReleasesPromises);

          setArtist(artistInfoResponse.data);

          // NOTE: The artist biography result property name
          // is a dynamic number (i.e., UID), but we
          // don't have that UID on hand to directly
          // access it (@see note in `utilities/axios.ts`)
          // So workaround that by extracting the first property.
          const firstArtistBiographyResultKey = Object.keys(
            artistBiographyResponse.data.query.pages
          )[0];
          const artistBiography =
            artistBiographyResponse.data.query.pages[
              firstArtistBiographyResultKey
            ].extract;
          setArtistBiography(artistBiography);
        }
      } catch (error) {
        if (!Axios.isCancel(error)) {
          console.log(error);
        }
      }
    })();

    return () => abortController.abort();
  }, [artistId]);

  const Genres = artist?.genres.map((genre) => (
    <span key={genre.id}>{genre.name.toUpperCase()}</span>
  ));

  // Foot note (1)
  // I'm not sure why tsc is saying that `toSorted` is being
  // invoked on an `any` type when it isn't... and also that
  // `release[A | B]["first-release-date"]` is an `any` type
  // when it isn't...
  /* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-argument */
  const latestRelease: ReleaseGroup = artist?.["release-groups"].toSorted(
    function yearDescending(releaseA, releaseB) {
      const aReleaseTimestamp = new Date(
        releaseA["first-release-date"]
      ).getTime();
      const bReleaseTimestamp = new Date(
        releaseB["first-release-date"]
      ).getTime();
      return bReleaseTimestamp - aReleaseTimestamp;
    }
  )[0];
  const hasLatestRelease = latestRelease != null;

  return (
    <BaseLayout>
      {artist && (
        <div className={CSS.container}>
          {/* Artist banner */}
          <div className={CSS.heroSectionContainer}>
            <section className={CSS.heroSection}>
              <h1>{artist.name}</h1>
              <Flair />
              <span>{Genres}</span>
            </section>
          </div>

          <div className={CSS.releasesSectionContainer}>
            {/* Latest release */}
            {hasLatestRelease && (
              <LatestReleaseSection latestRelease={latestRelease} />
            )}

            {/* Albums */}
            {hasAlbums && (
              <ReleaseSection
                releaseType="Album"
                releases={artist["release-groups"]}
              />
            )}

            {/* EPs */}
            {hasEPs && (
              <ReleaseSection
                releaseType="EP"
                releases={artist["release-groups"]}
              />
            )}

            {/* Singles */}
            {hasSingles && (
              <ReleaseSection
                releaseType="Single"
                releases={artist["release-groups"]}
              />
            )}
          </div>

          {/* About the artist */}
          <section className={CSS.aboutTheArtistSection}>
            <h3 className={CSS.aboutTheArtistSectionTitle}>
              About {artist.name}
            </h3>
            <p className={CSS.aboutTheArtistSectionBio}>{artistBiography}</p>

            <ArtistOriginSection artist={artist} />

            <ArtistSocialsSection relations={artist.relations} />

            <ArtistStreamingPlatformsSection relations={artist.relations} />
          </section>
        </div>
      )}
    </BaseLayout>
  );
}

export const artistRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "artist/$artistName/$artistId",
  component: Artist,
});

/**
 * Note to self for understanding the Array `sort` compare function:
 *  In the context used here, I'm comparing numbers (years) and want
 *  to sort it to descend.
 *
 *  Basic function to sort for ascending values
 *  function compareNumbers(a, b) {
 *    return a - b;
 *  }
 *
 *  Understanding for ascending algorithm:
 *    - *Note, we're thinking in terms of a here instead of b.
 *    - [a, b] if a = 1 and b = 2, because a - b === 1 - 2 === -1
 *        so a < b and therefore, a goes before b
 *    - [b, a] if a = 2 and b = 1, because a - b === 2 - 1 === 1
 *        so a > b and therefore, a goes after b
 *
 *
 *  Function to sort for descending values
 *  function compareNumbers(a, b) {
 *    return b - a;
 *  }
 *
 *  Understanding for descending algorithm:
 *    - *Aside from it just being a flip/inverse of the
 *        ascending algorithm, this is my attempt to note
 *        down my understanding.
 *    - *Note, we're thinking in terms of b here instead of a.
 *    - [a, b] if b is less than a; if a = 2 and b = 1, b - a === 1 - 2 === -1
 *        so b < a and therefore, b goes after a
 *    - [b, a] if b is greater than a; if a = 1 and b = 2, b - a === 2 - 1 === 1
 *        so b > a and therefore, b goes before a
 */

/**
 * Foot note (1)
 *
 * I had some issue initially trying to get the TS checker to stop
 * squigglying the `toSorted` Array method. I found out that it was
 * recently supported and is available in `typescript`'s nightly build.
 *
 * Sources:
 *  - https://github.com/microsoft/TypeScript/issues/54794
 *  - https://github.com/microsoft/TypeScript/issues/50333
 *  - https://www.typescriptlang.org/docs/handbook/nightly-builds.html
 */
