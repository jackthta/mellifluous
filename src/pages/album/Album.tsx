import { Route } from "@tanstack/router";

import { rootRoute } from "../../router";

export default function Album() {
  return <p>Album page</p>;
}

// TODO: make resulting route: /album/album-name/album-id
export const albumRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/album",
  component: Album,
});
