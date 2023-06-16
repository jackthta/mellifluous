import { Link, Route, useParams } from "@tanstack/router";
import { useEffect } from "react";

import { rootRoute } from "../../router";
import { MusicBrainz } from "../../utilities/axios";

import Flair from "../../components/flair/Flair";

import BaseLayout from "../../layout/base-layout/BaseLayout";

import type { AxiosResponse } from "axios";
import type { Artist } from "../../types/api/MusicBrainz";

import CSS from "./Artist.module.scss";

export default function Artist() {
  const { artistId } = useParams();

  // Fetch artist information
  // Note to self (remove later): url-rels contains all needed socials/streaming links (but
  // just be careful and check if it exists before displaying)
  useEffect(() => {
    const fetchArtistInfoPromise = MusicBrainz.get<null, AxiosResponse<Artist>>(
      `/artist/${artistId}`,
      {
        params: {
          inc: "genres releases url-rels",
        },
      }
    );

    void Promise.all([fetchArtistInfoPromise]).then(console.log);
  }, [artistId]);

  return (
    <BaseLayout>
      <div className={CSS.container}>
        {/* Artist banner */}
        <section>
          <h1>Artist Name</h1>
          <Flair />
          <span>Genre(s)</span>
        </section>

        <div>
          {/* TODO: Latest release */}
          <section>
            <h2>Latest Release</h2>
          </section>

          {/* TODO: Artist's albums */}
          <section>
            {/* TODO: add right chevron */}
            <h2>
              <Link>Albums</Link>
            </h2>
          </section>

          {/* TODO: Artist's singles & EPs */}
          <section>
            {/* TODO: add right chevron */}
            <h2>
              <Link>Singles & EPs</Link>
            </h2>
          </section>
        </div>

        {/* About the artist */}
        <section>
          <h3>About &#123;artist&#125;</h3>
          {/* TODO: need to figure out how to get this, API doesn't seem to return it? */}
          <p>Artist summary</p>

          <section>
            {/*
              NOTE (remove later): API doesn't return artist's origin state (probably because
                not every country has a state? So maybe try using the city/town + country
            */}
            <h4>Born:</h4> <span>YYYY (age ##), Origin &#123;Flag&#125;</span>
          </section>

          <section>
            <h4>Socials</h4>
            {/* TODO social links */}
          </section>

          <section>
            <h4>Stream</h4>
            {/* TODO: stream links */}
          </section>
        </section>

        <section>
          <h3>Similar Artists</h3>
          {/* TODO: artist profiles */}
        </section>
      </div>
    </BaseLayout>
  );
}

export const artistRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "artist/$artistName/$artistId",
  component: Artist,
});
