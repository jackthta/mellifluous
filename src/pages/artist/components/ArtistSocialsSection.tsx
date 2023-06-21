import SVG from "../../../components/SVG";

import type { Artist_Artist_Relation } from "../../../types/api/MusicBrainz";

import CSS from "../Artist.module.scss";

type Props = {
  relations: Artist_Artist_Relation[];
};
export default function ArtistSocialsSection({ relations }: Props) {
  const ArtistSocials = (
    <div className={CSS.aboutTheArtistSectionSocialsList}>
      {relations.filter(forWantedSocials).map((relation) => {
        let socialLabel = "";
        switch (relation.type) {
          case "official homepage":
            socialLabel = "Homepage";
            break;

          case "social network": {
            if (relation.url.resource.includes("twitter"))
              socialLabel = "Twitter";
            if (relation.url.resource.includes("instagram"))
              socialLabel = "Instagram";
            if (relation.url.resource.includes("facebook"))
              socialLabel = "Facebook";
            break;
          }
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
                name={socialLabel.toLowerCase()}
                className={CSS.aboutTheArtistSectionSocialsListSocialSVG}
              />
            </div>
            <span className={CSS.aboutTheArtistSectionSocialsListSocialLabel}>
              {socialLabel}
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
        Socials
      </h4>

      {ArtistSocials}
    </section>
  );
}

// Helper function(s)

function forWantedSocials(relation: Artist_Artist_Relation): boolean {
  return (
    relation.type === "official homepage" ||
    (relation.type === "social network" &&
      relation.url.resource.includes("twitter")) ||
    (relation.type === "social network" &&
      relation.url.resource.includes("instagram")) ||
    (relation.type === "social network" &&
      relation.url.resource.includes("facebook"))
  );
}
