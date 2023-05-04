import { Link } from "@tanstack/router";

import SVG from "../../components/SVG";

import type { ReactNode } from "react";

import CSS from "./BaseLayout.module.scss";
import "./BaseLayout.scss";

type Props = {
  children: ReactNode;
};

export default function BaseLayout({ children }: Props) {
  return (
    <>
      <header className={CSS.header}>
        <nav className={CSS.navigation}>
          <Link
            to="/"
            activeProps={{
              className: CSS.brandLink,
            }}
          >
            mellifluous
          </Link>
        </nav>
      </header>

      <main className={CSS.mainContainer}>
        <div className={CSS.main}>{children}</div>
      </main>

      <footer className={CSS.footerContainer}>
        {/* TODO: Light/Dark mode switch */}
        <div className={CSS.subfooter}></div>

        <div className={CSS.footerWrapper}>
          <div className={CSS.footer}>
            <a
              className={CSS.githubLink}
              href="https://github.com/jackthta/mellifluous"
              target="_blank"
              rel="noreferrer"
            >
              <SVG className={CSS.githubSvg} name="github" />
            </a>

            <p className={CSS.footerCopyrightText}>
              © 2023 <span>•</span> Jack Ta
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}