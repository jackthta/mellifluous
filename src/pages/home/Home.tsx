import { Route } from "@tanstack/router";

import { rootRoute } from "../../router";

import Flair from "../../components/flair/Flair";
import Search from "../../components/search/Search";

import BaseLayout from "../../layout/base-layout/BaseLayout";

import CSS from "./Home.module.scss";

export default function Home() {
  return (
    <BaseLayout withBackgroundCurveSVG>
      <div className={CSS.main}>
        <h1 className={CSS.heading}>Music is peace.</h1>

        <Flair />

        <Search />
      </div>
    </BaseLayout>
  );
}

export const homeRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Home,
});
