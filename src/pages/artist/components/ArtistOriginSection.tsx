import { FlagSVG } from "../../../components/SVG";

import type { Artist_Artist } from "../../../types/api/MusicBrainz";

import CSS from "../Artist.module.scss";

type Props = { artist: Artist_Artist };
export default function ArtistOriginSection({ artist }: Props) {
  const artistBirthYear = new Date(artist["life-span"].begin).getFullYear();
  const artistAge = calculateAge(artistBirthYear);
  const ArtistDOB = (
    <>
      <span>{artistBirthYear}</span> <span>(age {artistAge})</span>
    </>
  );

  const ArtistOrigin = (
    <span>
      {artist["begin-area"].name}{" "}
      <FlagSVG
        iso3166Alpha2CountryCode={artist.country}
        className={CSS.aboutTheArtistSectionOriginFlag}
      />
    </span>
  );

  return (
    <section className={CSS.aboutTheArtistSectionOrigin}>
      <h4 className={CSS.aboutTheArtistSectionLabel}>Born:</h4>{" "}
      <span>
        {ArtistDOB}, {ArtistOrigin}
      </span>
    </section>
  );
}

// Helper function(s)

function calculateAge(birthYear: number): number {
  const thisYear = new Date().getFullYear();
  return thisYear - birthYear;
}
