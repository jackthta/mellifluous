import { RootRoute, Router, createHashHistory } from "@tanstack/router";

import { homeRoute } from "./pages/home/Home";

export const rootRoute = new RootRoute();

// NOTE: The routes are located on their page component counterpart
// instead of here, because of this pattern that TanStack Router
// seems to impose (@see https://tanstack.com/router/v1/docs/guide/search-params#search-params-in-components).
// I would prefer to have all the routes centralized in this file,
// but the aforementioned pattern makes it difficult to have things
// be consistent (i.e., there would be some routes in some component
// files and some routes here; potential for confusion).
const routeTree = rootRoute.addChildren([homeRoute]);

export const router = new Router({ routeTree, history: createHashHistory() });

// Source: https://tanstack.com/router/v1/docs/guide/routes#registering-router-types
declare module "@tanstack/router" {
  interface Register {
    // This infers the type of the router and registers it across the entire application
    router: typeof router;
  }
}
