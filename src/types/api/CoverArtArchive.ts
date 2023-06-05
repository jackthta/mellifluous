type Images = {
  id: string;
  types: string[];
  front: boolean;
  back: boolean;
  edit: number;
  image: string;
  comment: string;
  approved: boolean;

  thumbnails: Thumbnails;
}[];

export type Thumbnails = {
  250: string;
  500: string;
  1200: string;

  small: string; // small is the same as 250
  large: string; // large is the same as 500
};

export type CoverArtArchiveResponse = {
  release: string;
  images: Images;
};
