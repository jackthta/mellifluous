import axios from "axios";

// `inc` parameter: https://musicbrainz.org/doc/MusicBrainz_API#inc.3D
export const MusicBrainz = axios.create({
  baseURL: "https://musicbrainz.org/ws/2",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// NOTE: The MusicBrainz API doesn't return data regarding
//  an artist's biography. This seems to be the only way,
//  as far as research extends, where an artist's biography
//  can be retrieved.
//  ⚠️ This may not be a robust solution, but _may_ work
//  80% of the time. That's because there is no strong link
//  between any artist identifier and the Wikipedia result
//  except for the name. Meaning, we're using the artist's
//  name to search for the artist's biography and going with
//  the first result back. If searching for an artist
//  whose name is common among other artists, the biography
//  data returned from Wikipedia _may not be correct_. This
//  solution heavily relies on the chance that an artist's name
//  is unique.
// Source: https://stackoverflow.com/a/28401782
export const Wikipedia = axios.create({
  baseURL: "https://en.wikipedia.org/w/api.php",
  params: {
    format: "json",
    action: "query",
    prop: "extracts",
    exintro: true,
    explaintext: true,
    redirects: 1,
    origin: "*",
  },
  headers: {
    Authorization: `Bearer ${process.env.WIKIPEDIA_BEARER_TOKEN}`,
    "Api-User-Agent": "mellifluous (https://github.com/jackthta/mellifluous)",
  },
});

export const CoverArtArchive = axios.create({
  baseURL: "https://coverartarchive.org/release/",
});
