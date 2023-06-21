import axios from "axios";
import { useEffect, useState } from "react";

import { CoverArtArchive } from "../../utilities/axios";

import type { Thumbnails } from "../../types/api/CoverArtArchive";
import type { AxiosResponse } from "axios";
import type { CoverArtArchiveResponse } from "../../types/api/CoverArtArchive";

type Props = {
  albumId: string;
  htmlSizes: string;

  className?: string;
};
export default function AlbumCoverArt({
  albumId,
  className,
  htmlSizes,
}: Props) {
  const [coverArt, setCoverArt] = useState<Thumbnails>(null);

  const coverArtSrcSet = generateCoverArtSrcSet(coverArt);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    // Fetch album's cover art image links
    void (async function fetchAlbumCoverArt() {
      try {
        const response = await CoverArtArchive.get<
          null,
          AxiosResponse<CoverArtArchiveResponse>
        >(albumId, {
          signal,
        });
        const responseOk = response.status >= 200 && response.status <= 299;

        if (responseOk) {
          setCoverArt(response.data.images[0].thumbnails);
        }
      } catch (error) {
        if (!axios.isCancel(error)) {
          console.error(error);
        }
      }
    })();

    return () => {
      abortController.abort();
    };
  }, [albumId]);

  return (
    coverArt && (
      <img
        className={className}
        style={{ borderRadius: "5px" }}
        src={coverArt[250]}
        alt=""
        srcSet={coverArtSrcSet}
        sizes={htmlSizes}
        width="250"
        height="250"
      />
    )
  );
}

function generateCoverArtSrcSet(coverArt: Thumbnails): string {
  if (coverArt?.[250] && coverArt?.[500] && coverArt?.[1200]) {
    return `${coverArt?.[250]} 250w, ${coverArt?.[500]} 500w, ${coverArt?.[1200]} 1200w`;
  }

  // NOTE: Sometimes the API doesn't return `250`, `500`, and `1200` properties
  //  and instead only has `small` (i.e. `250`) and `large` (i.e. `500`) properties.
  //  Prefer the former if possible, otherwise use this as fallback.
  if (coverArt?.small && coverArt?.large) {
    return `${coverArt?.small} 250w, ${coverArt?.large} 500w`;
  }
}
