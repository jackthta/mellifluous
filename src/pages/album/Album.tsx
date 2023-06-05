import { Link, Route, useParams } from "@tanstack/router";
import axios from "axios";
import { useEffect, useState } from "react";

import { CoverArtArchive, MusicBrainz } from "../../utilities/axios";

import { rootRoute } from "../../router";

import Flair from "../../components/flair/Flair";
import SVG from "../../components/SVG";

import BaseLayout from "../../layout/base-layout/BaseLayout";

import CSS from "./Album.module.scss";

import type { AxiosResponse } from "axios";
import type {
  CoverArtArchiveResponse,
  Thumbnails,
} from "../../types/api/CoverArtArchive";
import type { Release_Release } from "../../types/api/MusicBrainz";

export default function Album() {
  const { albumId } = useParams();

  const [coverArt, setCoverArt] = useState<Thumbnails>(null);
  const [album, setAlbum] = useState<Release_Release>(null);

  const albumReleaseDate = getAlbumReleaseDate();
  const albumReleaseYear = getAlbumReleaseYear();
  const albumArtist = getAlbumArtist();
  const albumLabel = getAlbumLabel();
  const albumNumberOfSongs = getAlbumNumberOfSongs();
  const albumTotalLengthInMinutes = getAlbumTotalLength();

  const coverArtSrcSet = `${coverArt?.[250]} 250w, ${coverArt?.[500]} 500w, ${coverArt?.[1200]} 1200w`;
  const coverArtSizes = `(max-width: 700px) 100vw, 33vw`;

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    // Fetch album data
    void (async function fetchAlbumData() {
      try {
        const response = await MusicBrainz.get<
          null,
          AxiosResponse<Release_Release>
        >(`/release/${albumId}`, {
          params: {
            inc: "artist-credits recordings labels genres",
          },
          signal,
        });
        const responseOk = response.status >= 200 && response.status <= 299;

        if (responseOk) {
          setAlbum(response.data);
        }
      } catch (error) {
        if (!axios.isCancel(error)) {
          console.error(error);
        }
      }
    })();

    // Fetch album's cover art
    void (async function fetchAlbumCoverArt() {
      try {
        const response = await CoverArtArchive.get<
          null,
          AxiosResponse<CoverArtArchiveResponse>
        >(albumId, {
          signal,
        });
        const responseOk = response.status >= 200 && response.status <= 299;

        if (responseOk) {
          setCoverArt(response.data.images[0].thumbnails);
        }
      } catch (error) {
        if (!axios.isCancel(error)) {
          console.error(error);
        }
      }
    })();

    return () => {
      abortController.abort();
    };
  }, [albumId]);

  const TrackList = album?.media[0].tracks.map((track) => {
    // Enhancement: make this into a component and re-use in <SearchResults>
    let duration = null;
    if (track.length != null) {
      const lengthInSeconds = Math.round(track.length / 1000);
      const durationMinutes = Math.trunc(lengthInSeconds / 60);
      // NOTE: remainder of 0 - 9 seconds needs to be padded on the left
      // with one zero. `padEnd` works for 0, but not for 1 - 9 (since it
      // makes 10 -> 90), whereas `padStart` works for both 0 and 1 - 9.
      const durationSeconds = (lengthInSeconds % 60)
        .toString()
        .padStart(2, "0");
      duration = `${durationMinutes}:${durationSeconds}`;
    }

    return (
      <Link className={CSS.track} key={track.id}>
        <span className={CSS.trackPosition}>{track.position}</span>
        <span className={CSS.trackTitle}>{track.title}</span>
        <span className={CSS.trackDuration}>{duration}</span>
      </Link>
    );
  });

  return (
    <BaseLayout>
      <div className={CSS.container}>
        <div className={CSS.main}>
          {/* Artist back link */}
          {/* TODO: link to artist page */}
          <Link className={CSS.artistBackLink}>
            <SVG name="chevron-left" />
            <span>{albumArtist}</span>
          </Link>

          <div className={CSS.heroContainer}>
            {coverArt && (
              <img
                className={CSS.coverArt}
                src={coverArt[250]}
                alt=""
                srcSet={coverArtSrcSet}
                sizes={coverArtSizes}
                width="250"
                height="250"
              />
            )}
            {album && (
              <div className={CSS.albumInfoContainer}>
                <span className={CSS.albumTitle}>{album.title}</span>
                <span className={CSS.albumArtist}>{albumArtist}</span>
                <span className={CSS.albumReleaseYear}>{albumReleaseYear}</span>
              </div>
            )}
          </div>

          <Flair />

          {/* Foot note (1) */}
          <div className={CSS.tracklist}>{TrackList}</div>
        </div>

        {/* Album metadata */}
        <div className={CSS.albumMetaDataContainer}>
          <div className={CSS.albumMetaData}>
            <span>Released {albumReleaseDate}</span>
            <span>
              {albumNumberOfSongs} Songs • {albumTotalLengthInMinutes} minutes
            </span>
            <span>
              ℗ {albumReleaseYear} {albumLabel}
            </span>
          </div>
        </div>
      </div>
    </BaseLayout>
  );

  // ********************************************************
  // Helper functions to abstract away implementation details
  // ********************************************************

  function getAlbumReleaseDate() {
    const formatOptions: Intl.DateTimeFormatOptions = { dateStyle: "long" };
    const dateFormatter = new Intl.DateTimeFormat("en-US", formatOptions);

    return album && dateFormatter.format(new Date(album.date));
  }

  function getAlbumReleaseYear() {
    return new Date(album?.date).getFullYear();
  }

  function getAlbumArtist() {
    // If there are multiple artists, concat them
    // with the join phrase delimiter (which should in the form: " & ")
    return album?.["artist-credit"]
      .map((_artist) => {
        let artist = _artist.name;
        if (_artist.joinphrase) artist += _artist.joinphrase;
        return artist;
      })
      .join("");
  }

  function getAlbumLabel() {
    return album?.["label-info"][0].label.name;
  }

  function getAlbumNumberOfSongs() {
    return album?.media[0]["track-count"];
  }

  function getAlbumTotalLength() {
    const totalAlbumLengthInMilliseconds = album?.media[0].tracks.reduce(
      (accumulator, album) => accumulator + album.length,
      0
    );
    const totalAlbumLengthInSeconds = totalAlbumLengthInMilliseconds / 1000;
    const totalAlbumLengthInMinutes = Math.trunc(
      totalAlbumLengthInSeconds / 60
    );

    return totalAlbumLengthInMinutes;
  }
}

export const albumRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/album/$albumName/$albumId",
  component: Album,
});

/**
 * Foot note (1) — (remove later)
 *
 * Going to try making this list with a grid instead of
 * a table for better DX and to see if it works better (e.g., whether the
 * click navigation is easier to handle with a grid than a table). If a grid works
 * better, refactor <SearchResults> to use it too, if not, refactor this to a table
 * and also extract out the <tr> to re-use in both here and <SearchResults>
 *
 */
