import { Route } from "@tanstack/router";

import { rootRoute } from "../../router";

export default function Artist() {
  return <p>Artist page</p>;
}

export const artistRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "artist/$artistName/$artistId",
  component: Artist,
});
