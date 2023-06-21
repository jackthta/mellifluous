import { Link } from "@tanstack/router";
import Axios from "axios";
import { useEffect, useState } from "react";

import { albumRoute } from "../../album/Album";

import { MusicBrainz } from "../../../utilities/axios";
import { formatDate } from "../../../utilities/date";

import AlbumCoverArt from "../../../components/album-cover-art/AlbumCoverArt";

import type { AxiosResponse } from "axios";
import type {
  ReleaseGroup,
  Release_Release,
} from "../../../types/api/MusicBrainz";

import CSS from "../Artist.module.scss";

type Props = {
  latestRelease: ReleaseGroup;
};
export default function LatestReleaseSection({ latestRelease }: Props) {
  const [trackCount, setTrackCount] = useState<number>(null);

  const linkParams = {
    albumName: latestRelease.title.replaceAll(" ", "-").toLowerCase(),
    albumId: latestRelease["release-id"],
  };

  // Fetch track count for this release
  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    void (async function getNumberOfTracks() {
      try {
        const response = await MusicBrainz.get<
          null,
          AxiosResponse<Release_Release>
        >(`/release/${latestRelease["release-id"]}`, {
          params: {
            inc: "media",
          },
          signal,
        });

        if (response.status >= 200 && response.status <= 299) {
          setTrackCount(response.data.media[0]["track-count"]);
        }
      } catch (error) {
        if (!Axios.isCancel(error)) {
          console.log(error);
        }
      }
    })();

    return () => abortController.abort();
  }, []);

  const TrackCount = trackCount && (
    <span className={CSS.latestReleaseTrackCount}>
      {trackCount} Song{trackCount > 1 ? "s" : ""}
    </span>
  );

  return (
    <section className={CSS.latestReleaseSection}>
      <h2 className={CSS.latestReleaseSectionTitle}>Latest Release</h2>

      <Link
        to={albumRoute.path}
        params={linkParams}
        className={CSS.latestReleaseInfoContainer}
      >
        <AlbumCoverArt
          albumId={latestRelease["release-id"]}
          htmlSizes="(max-width: 300px) 50vw, 16vw"
        />

        <div className={CSS.latestReleaseMetadata}>
          <span className={CSS.latestReleaseReleaseDate}>
            {formatDate(
              latestRelease["first-release-date"],
              "medium"
            ).toUpperCase()}
          </span>
          <span className={CSS.latestReleaseTitle}>
            {latestRelease.title} — {latestRelease["primary-type"]}
          </span>
          {TrackCount}
        </div>
      </Link>
    </section>
  );
}
