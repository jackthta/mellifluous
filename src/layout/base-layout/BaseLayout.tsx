import { Link } from "@tanstack/router";

import SVG from "../../components/SVG";

import type { ReactNode } from "react";

import CSS from "./BaseLayout.module.scss";
import "./BaseLayout.scss";

type Props = {
  withBackgroundCurveSVG?: boolean;
  children: ReactNode;
};

const defaultProps: Props = {
  withBackgroundCurveSVG: false,
  children: <></>,
};

const BaseLayout: React.FC<Props> = ({
  withBackgroundCurveSVG,
  children,
}: Props) => {
  const mainClass = `${CSS.mainContainer} ${
    withBackgroundCurveSVG ? CSS.backgroundCurveSVG : ""
  }`;

  return (
    <>
      <header className={CSS.header}>
        <nav className={CSS.navigation}>
          <Link to="/" className={CSS.brandLink}>
            mellifluous
          </Link>
        </nav>
      </header>

      <main className={mainClass}>{children}</main>

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
};

BaseLayout.defaultProps = defaultProps;

export default BaseLayout;
