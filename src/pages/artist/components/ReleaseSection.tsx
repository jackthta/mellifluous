import { Link } from "@tanstack/router";

import { albumRoute } from "../../album/Album";

import AlbumCoverArt from "../../../components/album-cover-art/AlbumCoverArt";

import type { ReleaseGroup } from "../../../types/api/MusicBrainz";

import CSS from "../Artist.module.scss";

type Props = {
  releaseType: "Album" | "Single" | "EP";
  releases: ReleaseGroup[];
};
export default function ReleaseSection({ releaseType, releases }: Props) {
  // I'm not sure why tsc is saying that `toSorted` is being
  // invoked on an `any` type when it isn't... and also that
  // `release[A | B]["first-release-date"]` is an `any` type
  // when it isn't...
  /* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-argument */
  const ReleaseList = (
    <div className={CSS.releasesList}>
      {releases
        .filter((release) => release["primary-type"] === releaseType)
        .toSorted(function sortYearDescending(releaseA, releaseB) {
          const releaseAYear = Number(
            new Date(releaseA["first-release-date"]).getFullYear()
          );
          const releaseBYear = Number(
            new Date(releaseB["first-release-date"]).getFullYear()
          );
          return releaseBYear - releaseAYear;
        })
        .map((release) => {
          const linkParams = {
            albumName: release.title.replaceAll(" ", "-").toLowerCase(),
            albumId: release["release-id"],
          };

          return (
            <Link
              to={albumRoute.path}
              params={linkParams}
              key={release.id}
              className={CSS.release}
            >
              <AlbumCoverArt
                albumId={release["release-id"]}
                htmlSizes="(max-width: 300px) 50vw, 16vw"
              />
              <span className={CSS.releaseTitle}>{release.title}</span>
              <span className={CSS.releaseReleaseDate}>
                {new Date(release["first-release-date"]).getFullYear()}
              </span>
            </Link>
          );
        })}
    </div>
  );

  return (
    <section className={CSS.releaseSection}>
      <h2 className={CSS.releaseSectionTitle}>{releaseType}s</h2>

      {/* TODO: lazy load all album cover art images below/outside the fold*/}
      {ReleaseList}
    </section>
  );
}
