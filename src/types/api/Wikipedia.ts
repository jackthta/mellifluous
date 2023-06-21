export type ArtistBiography = {
  batchcomplete: string;
  query: {
    pages: {
      [result: number | string]: {
        extract: string; // Artist's biography
        ns: number;
        pageid: number;
        title: string; // Artist name
      };
    };
  };
};
