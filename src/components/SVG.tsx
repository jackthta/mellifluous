import { useEffect, useState } from "react";
import { sanitize as sanitizeHtml } from "dompurify";

// Enhancement: refactor <SVG> component so that it's not so repetitive (DRY).

type SVGProps = {
  name: "github" | "search" | "person" | "group" | "chevron-left";
  className?: string;
};
export default function SVG({ name, className }: SVGProps) {
  switch (name) {
    case "github":
      return GitHubSVG(className);
    case "search":
      return SearchSVG(className);
    case "person":
      return PersonSVG(className);
    case "group":
      return GroupSVG(className);
    case "chevron-left":
      return ChevronLeftSVG(className);
  }
}

/**
 * MusicBrainz proprietary country codes
 * XC — Czechoslovakia (Historical, October 1918 - January 1992 (3166-3 CSHH))
 * XG — East Germany (Historical, 1949 - 1990 (3166-3 DDDE))
 * XE — Europe (for European releases where specific country unknown)
 * CS — Serbia and Montenegro (Historical, February 2003 - June 2006 (3166-3 CSXX))
 * SU — Soviet Union (Historical, 1922 - 1991 (3166-3 SUHH))
 * XU — [Unknown Country] (NOTE: did not obtain associated flag SVG)
 * XW — [Worldwide]
 * YU — Yugoslavia (Historical, 1918 - 2003 (3166-3 YUCS))
 * Source 1: https://musicbrainz.org/doc/Release_Country
 * Source 2: https://en.wikipedia.org/wiki/ISO_3166-1
 *
 * Enhancement: lazy load flag SVGs below the fold
 */
type FlagSvgProps = {
  iso3166Alpha2CountryCode: string;
};
export function FlagSVG({ iso3166Alpha2CountryCode }: FlagSvgProps) {
  const [flagSvgHtmlString, setFlagSvgHtmlString] = useState(null);

  // Dynamically import flag's SVG
  useEffect(() => {
    void (async function loadFlagSvg() {
      // Source: https://stackoverflow.com/a/73359606
      const { default: flagSvgHtmlString }: { default: string } = await import(
        `../assets/svgs/flags/${iso3166Alpha2CountryCode}.svg`
      );

      // Sanitize flag SVG HTML string. Most definitely should not
      // contain any malicious script code, but took this opportunity
      // to implement HTML sanitization for practice.
      // Source: https://stackoverflow.com/a/65989066
      const sanitizedFlagSvgHtmlString = sanitizeHtml(flagSvgHtmlString);

      setFlagSvgHtmlString(sanitizedFlagSvgHtmlString);
    })();
  }, []);

  return (
    flagSvgHtmlString && (
      <span dangerouslySetInnerHTML={{ __html: flagSvgHtmlString }}></span>
    )
  );
}

function GitHubSVG(className: string) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <path
        d="M15.159 22c.175-1.905.42-5.334-.527-6.19-1.053.476 10.529-1.429 4.738-10.477.351-.635.526-1.904 0-3.333-1.58 0-3.159.476-4.211 1.429-.351-.16-1.474-.477-3.159-.477M9.156 22a42.239 42.239 0 0 1-.14-2.381M12 2.952c-1.517 0-2.528.318-2.844.477-.948-.953-2.37-1.43-3.792-1.429-.474 1.429-.316 2.698 0 3.333C.15 14.381 10.578 16.286 9.63 15.81c-.5.503-.631 1.889-.622 3.334m0 0C7.462 18.825 4.896 17.523 3 16c2.844 2.381 1.37 3.619 6.016 3.619m-.008-.476c.001.158.004.317.008.476"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SearchSVG(className: string) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      strokeWidth="2"
      stroke="currentColor"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M0 0h24v24H0z" stroke="none" />
      <path d="M3 10a7 7 0 1 0 14 0 7 7 0 1 0-14 0m18 11-6-6" />
    </svg>
  );
}

function PersonSVG(className: string) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <circle
        cx="12"
        cy="7"
        r="3"
        stroke="#333"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 13h-4a4 4 0 0 0-4 4 3 3 0 0 0 3 3h6a3 3 0 0 0 3-3 4 4 0 0 0-4-4Z"
        stroke="#333"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GroupSVG(className: string) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <circle
        cx="9"
        cy="7"
        r="3"
        stroke="#333"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 10a3 3 0 1 0 0-6m-3 9H7a4 4 0 0 0-4 4 3 3 0 0 0 3 3h6a3 3 0 0 0 3-3 4 4 0 0 0-4-4Zm6 0a4 4 0 0 1 4 4 3 3 0 0 1-3 3"
        stroke="#333"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronLeftSVG(className: string) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <path
        d="m10 12.4 4.5 5.4M10 12.4 14.5 7"
        stroke="#333"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
