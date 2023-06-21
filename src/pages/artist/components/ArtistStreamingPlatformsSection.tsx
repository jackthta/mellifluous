import SVG from "../../../components/SVG";

import type { Artist_Artist_Relation } from "../../../types/api/MusicBrainz";

import CSS from "../Artist.module.scss";

type Props = { relations: Artist_Artist_Relation[] };
export default function ArtistStreamingPlatformsSection({ relations }: Props) {
  const ArtistStreamingPlatforms = (
    <div className={CSS.aboutTheArtistSectionSocialsList}>
      {relations.filter(forWantedStreamingPlatforms).map((relation) => {
        let streamingPlatformLabel = "";
        switch (relation.type) {
          case "free streaming":
            streamingPlatformLabel = "Spotify";
            break;

          case "streaming":
            streamingPlatformLabel = "Apple Music";
            break;

          default:
            streamingPlatformLabel = relation.type.replace(
              relation.type[0],
              relation.type[0].toUpperCase()
            );
            break;
        }

        return (
          <a
            key={relation.url.id}
            className={CSS.aboutTheArtistSectionSocialsListSocial}
            href={relation.url.resource}
            target="_blank"
            rel="noreferrer"
          >
            <div
              aria-hidden="true"
              className={CSS.aboutTheArtistSectionSocialsListSocialRing}
            >
              <SVG
                name={streamingPlatformLabel.replace(" ", "-").toLowerCase()}
                className={CSS.aboutTheArtistSectionSocialsListSocialSVG}
              />
            </div>
            <span className={CSS.aboutTheArtistSectionSocialsListSocialLabel}>
              {streamingPlatformLabel}
            </span>
          </a>
        );
      })}
    </div>
  );

  return (
    <section className={CSS.aboutTheArtistSectionSocials}>
      <h4
        className={`${CSS.aboutTheArtistSectionLabel} ${CSS.aboutTheArtistSectionSocialsLabel}`}
      >
        Stream
      </h4>

      {ArtistStreamingPlatforms}
    </section>
  );
}

// Helper function(s)

function forWantedStreamingPlatforms(relation: Artist_Artist_Relation) {
  return (
    relation.type === "youtube" ||
    relation.type === "soundcloud" ||
    (relation.type === "free streaming" &&
      relation.url.resource.includes("spotify")) ||
    (relation.type === "streaming" && relation.url.resource.includes("apple"))
  );
}
