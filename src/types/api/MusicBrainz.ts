type Entity = {
  created: string;
  count: number;
  offset: number;
};

export type Recording = Entity & {
  recordings: Recording_Recording[];
};

type Recording_Recording = {
  id: string;
  score: string;
  title: string;
  "first-release-date": string;
  length: number;
  "artist-credit": ArtistCredit[];
  releases: Recording_Recording_Release[];
  isrcs: Recording_Recording_Isrcs[];
  tags: Recording_Recording_Tags[];
};

type Recording_Recording_Release = {
  id: string;
  title: string;
  "status-id": string;
  status: string;
  date: string;
  country: string;
  "track-count": number;
  "release-group": Recording_Recording_Release_ReleaseGroup;
  "release-events": ReleaseEvent[];

  media: Recording_Recording_Release_Media[];
};

type Recording_Recording_Release_ReleaseGroup = {
  id: string;
  "primary-type": string;
};

type Recording_Recording_Release_Media = {
  position: number;
  format: string;
  "track-count": number;
  "track-offset": number;
  track: Recording_Recording_Release_Media_Track[];
};

type Recording_Recording_Release_Media_Track = {
  id: string;
  number: string;
  title: string;
  length: number;
};

type Recording_Recording_Isrcs = {
  id: string;
};

type Recording_Recording_Tags = {
  name: string;
  count: number;
};

// ****************************************
// ****************************************

export type Release = Entity & {
  releases: Release_Release[];
};

export type Release_Release = {
  id: string;
  score: string;
  title: string;
  "status-id": string;
  status: string;
  packaging: string;
  date: string;
  country: string;
  barcode: string;
  count: number;
  "track-count": number;
  "text-representation": Release_Release_TextRepresentation;
  "artist-credit": ArtistCredit[];
  "release-group": Release_Release_ReleaseGroup;
  "release-events": Release_Release_ReleaseEvent[];
  "label-info": Release_Release_LabelInfo[];
  media: Release_Release_Media[];
};

type Release_Release_TextRepresentation = {
  language: string;
  script: string;
};

type Release_Release_ReleaseGroup = {
  id: string;
  "primary-type": string;
};

type Release_Release_ReleaseEvent = {
  date: string;
  area: Release_Release_ReleaseEvent_Area;
};

type Release_Release_ReleaseEvent_Area = {
  id: string;
  name: string;
  "sort-name": string;
  "iso-3166-1-codes": string[];
};

type Release_Release_LabelInfo = {
  "catalog-number": string;
  label: Release_Release_LabelInfo_Label;
};

type Release_Release_LabelInfo_Label = {
  id: string;
  name: string;
};

type Release_Release_Media = {
  format: string;
  "format-id": string;
  position: number;
  title: string;
  "track-count": number;
  "track-offset": number;
  tracks: Release_Release_Media_Track[];
};

type Release_Release_Media_Track = {
  id: string;
  "artist-credit": ArtistCredit[];
  length: number;
  number: string;
  position: number;
  title: string;
};

// ****************************************
// ****************************************

export type Artist = Entity & {
  artists: Artist_Artist[];
};

export type Artist_Artist = {
  id: string;
  type?: "Person" | "Group";
  score: string;
  name: string;
  "sort-name": string;
  country: string;
  disambiguation: string;
  area: Artist_Artist_Area;
  "begin-area": Artist_Artist_Area;
  "life-span": Artist_Artist_LifeSpan;
  aliases: Alias[];
  tags: Artist_Artist_Tag[];
  genres?: Genre[];
  relations?: Artist_Artist_Relation[];
  releases?: Artist_Artist_Release[];
  "release-groups"?: ReleaseGroup[];
};

type Artist_Artist_Area = {
  id: string;
  name: string;
  "sort-name": string;
};

type Artist_Artist_LifeSpan = {
  begin: string;
  end: string;
  ended: boolean;
};

type Artist_Artist_Tag = {
  count: number;
  name: string;
};

export type Artist_Artist_Relation = {
  type:
    | "allmusic"
    | "bandsintown"
    | "discogs"
    | "free streaming"
    | "last.fm"
    | "lyrics"
    | "official homepage"
    | "other databases"
    | "purchase for download"
    | "setlistfm"
    | "social network"
    | "songkick"
    | "soundcloud"
    | "streaming"
    | "VIAF"
    | "wikidata"
    | "youtube";
  "type-id": string;
  url: {
    id: string;
    resource: string;
  };
  direction: string;
  ended: boolean;
  "source-credit": string;
  "target-credit": string;
  "target-type": string;

  // Documentation doesn't cover what kind of types these properties contain
  "attribute-ids": object;
  "attribute-values": object;
  attributes: [];
  begin: any;
  end: any;
};

type Artist_Artist_Release = {
  id: string;
  title: string;
  date: string;
  genres: [];

  country: string;
  disambiguation: string;
  barcode: string;
  packaging: string;
  "packaging-id": string;
  quality: string;
  "release-events": ReleaseEvent[];
  "release-group": ReleaseGroup;
  status: string;
  "status-id": string;
  "text-representation": { language: string; script: string };
};

export type ReleaseGroup = {
  id: string;
  title: string;
  "primary-type": string;
  "primary-type-id": string;
  "first-release-date": string;
  genres: Genre[];
  disambiguation: string;
  releases?: Release_Release[];

  // Documentation doesn't cover what kind of types these properties contain
  "secondary-type": [];
  "secondary-type-ids": [];

  // Not returned from API; just for app use
  "release-id": string | null;
};

type Alias = {
  "sort-name": string;
  name: string;
  type: string;
  locale: string | null;
  primary: string | null;
  "begin-date": string | null;
  "end-date": string | null;
};

type ArtistCredit = {
  artist: {
    id: string;
    name: string;
    "sort-name": string;
    aliases: Alias[];
  };
  joinphrase?: string;
  name: string;
};

type Genre = {
  id: string;
  count: number;
  disambiguation: string;
  name: string;
};

type ReleaseEvent = {
  date: string;
  area: ReleaseEvent_Area;
};

type ReleaseEvent_Area = {
  id: string;
  name: string;
  "sort-name": string;
  "iso-3166-1-codes": string[];
};
