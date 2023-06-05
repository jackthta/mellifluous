import axios from "axios";

export const MusicBrainz = axios.create({
  baseURL: "https://musicbrainz.org/ws/2",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

export const CoverArtArchive = axios.create({
  baseURL: "https://coverartarchive.org/release/",
});
