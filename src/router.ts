import { RootRoute, Route, Router } from "@tanstack/router";

import Home from "./pages/home/Home";

const rootRoute = new RootRoute();
const homeRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Home,
});

const routeTree = rootRoute.addChildren([homeRoute]);

export const router = new Router({ routeTree });

// Source: https://tanstack.com/router/v1/docs/guide/routes#registering-router-types
declare module "@tanstack/router" {
  interface Register {
    // This infers the type of the router and registers it across the entire application
    router: typeof router;
  }
}
