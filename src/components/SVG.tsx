import { useEffect, useState } from "react";
import { sanitize as sanitizeHtml } from "dompurify";

// Enhancement: refactor <SVG> component so that it's not so repetitive (DRY).

type SVGProps = {
  name:
    | "github"
    | "search"
    | "person"
    | "group"
    | "chevron-left"
    | "homepage"
    | "twitter"
    | "instagram"
    | "facebook"
    | "spotify"
    | "youtube"
    | "soundcloud"
    | "apple-music"
    | string;
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
    case "homepage":
      return HomepageSVG(className);
    case "twitter":
      return TwitterSVG(className);
    case "instagram":
      return InstagramSVG(className);
    case "facebook":
      return FacebookSVG(className);
    case "spotify":
      return SpotifySVG(className);
    case "youtube":
      return YouTubeSVG(className);
    case "soundcloud":
      return SoundCloudSVG(className);
    case "apple-music":
      return AppleMusicSVG(className);
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
  className?: string;
};
export function FlagSVG({ iso3166Alpha2CountryCode, className }: FlagSvgProps) {
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
      <span
        className={className}
        dangerouslySetInnerHTML={{ __html: flagSvgHtmlString }}
      ></span>
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

function HomepageSVG(className) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={className}
    >
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
    </svg>
  );
}

function TwitterSVG(className) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 333333 333333"
      shapeRendering="geometricPrecision"
      textRendering="geometricPrecision"
      imageRendering="optimizeQuality"
      fillRule="evenodd"
      clipRule="evenodd"
      className={className}
    >
      <path
        d="M166667 0c92048 0 166667 74619 166667 166667s-74619 166667-166667 166667S0 258715 0 166667 74619 0 166667 0zm90493 110539c-6654 2976-13822 4953-21307 5835 7669-4593 13533-11870 16333-20535-7168 4239-15133 7348-23574 9011-6787-7211-16426-11694-27105-11694-20504 0-37104 16610-37104 37101 0 2893 320 5722 949 8450-30852-1564-58204-16333-76513-38806-3285 5666-5022 12109-5022 18661v4c0 12866 6532 24246 16500 30882-6083-180-11804-1876-16828-4626v464c0 17993 12789 33007 29783 36400-3113 845-6400 1313-9786 1313-2398 0-4709-247-7007-665 4746 14736 18448 25478 34673 25791-12722 9967-28700 15902-46120 15902-3006 0-5935-184-8860-534 16466 10565 35972 16684 56928 16684 68271 0 105636-56577 105636-105632 0-1630-36-3209-104-4806 7251-5187 13538-11733 18514-19185l17-17-3 2z"
        fill="#1da1f2"
      />
    </svg>
  );
}

function InstagramSVG(className) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 333333 333333"
      shapeRendering="geometricPrecision"
      textRendering="geometricPrecision"
      imageRendering="optimizeQuality"
      fillRule="evenodd"
      clipRule="evenodd"
      className={className}
    >
      <defs>
        <linearGradient
          id="a"
          gradientUnits="userSpaceOnUse"
          x1="250181"
          y1="308196"
          x2="83152.4"
          y2="25137"
        >
          <stop offset="0" stopColor="#f58529" />
          <stop offset=".169" stopColor="#feda77" />
          <stop offset=".478" stopColor="#dd2a7b" />
          <stop offset=".78" stopColor="#8134af" />
          <stop offset="1" stopColor="#515bd4" />
        </linearGradient>
      </defs>
      <path
        d="M166667 0c92048 0 166667 74619 166667 166667s-74619 166667-166667 166667S0 258715 0 166667 74619 0 166667 0zm-40642 71361h81288c30526 0 55489 24654 55489 54772v81069c0 30125-24963 54771-55488 54771l-81289-1c-30526 0-55492-24646-55492-54771v-81069c0-30117 24966-54771 55492-54771zm40125 43843c29663 0 53734 24072 53734 53735 0 29667-24071 53735-53734 53735-29672 0-53739-24068-53739-53735 0-29663 24068-53735 53739-53735zm0 18150c19643 0 35586 15939 35586 35585 0 19647-15943 35589-35586 35589-19650 0-35590-15943-35590-35589s15940-35585 35590-35585zm51986-25598c4819 0 8726 3907 8726 8721 0 4819-3907 8726-8726 8726-4815 0-8721-3907-8721-8726 0-4815 3907-8721 8721-8721zm-85468-20825h68009c25537 0 46422 20782 46422 46178v68350c0 25395-20885 46174-46422 46174l-68009 1c-25537 0-46426-20778-46426-46174v-68352c0-25395 20889-46177 46426-46177z"
        fill="url(#a)"
      />
    </svg>
  );
}

function FacebookSVG(className) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 506.86 506.86"
      className={className}
    >
      <path
        fill="#1877f2"
        d="M506.86 253.43C506.86 113.46 393.39 0 253.43 0S0 113.46 0 253.43c0 126.49 92.68 231.34 213.83 250.35V326.69h-64.35v-73.26h64.35V197.6c0-63.52 37.84-98.6 95.72-98.6 27.73 0 56.73 5 56.73 5v62.36h-31.95c-31.49 0-41.3 19.54-41.3 39.58v47.54h70.28l-11.23 73.26H293v177.04c121.18-19.01 213.86-123.86 213.86-250.35Z"
      />
      <path
        fill="#fff"
        d="m352.08 326.69 11.23-73.26H293v-47.54c0-20 9.81-39.58 41.3-39.58h31.95V104s-29-5-56.73-5c-57.88 0-95.72 35.08-95.72 98.6v55.83h-64.32v73.26h64.35v177.09a256.11 256.11 0 0 0 79.2 0V326.69Z"
      />
    </svg>
  );
}

function SpotifySVG(className) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 496 512"
      className={className}
    >
      <path
        fill="#1ed760"
        d="M248 8C111.1 8 0 119.1 0 256s111.1 248 248 248 248-111.1 248-248S384.9 8 248 8Z"
      />
      <path d="M406.6 231.1c-5.2 0-8.4-1.3-12.9-3.9-71.2-42.5-198.5-52.7-280.9-29.7-3.6 1-8.1 2.6-12.9 2.6-13.2 0-23.3-10.3-23.3-23.6 0-13.6 8.4-21.3 17.4-23.9 35.2-10.3 74.6-15.2 117.5-15.2 73 0 149.5 15.2 205.4 47.8 7.8 4.5 12.9 10.7 12.9 22.6 0 13.6-11 23.3-23.2 23.3zm-31 76.2c-5.2 0-8.7-2.3-12.3-4.2-62.5-37-155.7-51.9-238.6-29.4-4.8 1.3-7.4 2.6-11.9 2.6-10.7 0-19.4-8.7-19.4-19.4s5.2-17.8 15.5-20.7c27.8-7.8 56.2-13.6 97.8-13.6 64.9 0 127.6 16.1 177 45.5 8.1 4.8 11.3 11 11.3 19.7-.1 10.8-8.5 19.5-19.4 19.5zm-26.9 65.6c-4.2 0-6.8-1.3-10.7-3.6-62.4-37.6-135-39.2-206.7-24.5-3.9 1-9 2.6-11.9 2.6-9.7 0-15.8-7.7-15.8-15.8 0-10.3 6.1-15.2 13.6-16.8 81.9-18.1 165.6-16.5 237 26.2 6.1 3.9 9.7 7.4 9.7 16.5s-7.1 15.4-15.2 15.4z" />
    </svg>
  );
}

function YouTubeSVG(className) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 333333 333333"
      shapeRendering="geometricPrecision"
      textRendering="geometricPrecision"
      imageRendering="optimizeQuality"
      fillRule="evenodd"
      clipRule="evenodd"
      className={className}
    >
      <path
        d="M166667 0c92048 0 166667 74619 166667 166667s-74619 166667-166667 166667S0 258715 0 166667 74619 0 166667 0zm84195 132297s-1678-11849-6843-17052c-6545-6843-13873-6887-17223-7283-24036-1751-60138-1751-60138-1751h-63s-36085 0-60135 1751c-3363 409-10681 437-17223 7283-5168 5203-6811 17052-6811 17052s-1711 13904-1711 27838v13029c0 13905 1709 27837 1709 27837s1678 11849 6811 17061c6542 6843 15139 6621 18977 7350 13761 1314 58457 1710 58457 1710s36133-64 60169-1783c3363-397 10678-438 17223-7284 5168-5202 6843-17065 6843-17065s1711-13904 1711-27837v-13028c-35-13905-1745-27837-1745-27837l-9 9-1-1zm-102010 56674v-48312l46437 24237-46437 24075z"
        fill="red"
      />
    </svg>
  );
}

function SoundCloudSVG(className) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      shapeRendering="geometricPrecision"
      textRendering="geometricPrecision"
      imageRendering="optimizeQuality"
      fillRule="evenodd"
      clipRule="evenodd"
      viewBox="0 0 512 512"
      className={className}
    >
      <path
        fill="#F50"
        d="M256 0c141.385 0 256 114.615 256 256S397.385 512 256 512 0 397.385 0 256 114.615 0 256 0z"
      />
      <path
        fill="#fff"
        d="M418.489 276.191c-1.363 24.352-21.689 43.295-46.074 42.958H261.672c-5.072-.053-9.167-4.167-9.195-9.234V190.674a10.162 10.162 0 0 1 6.117-9.709s10.187-7.064 31.642-7.064a72.59 72.59 0 0 1 37.237 10.231 73.684 73.684 0 0 1 34.669 48.018 42.73 42.73 0 0 1 11.746-1.6 44.34 44.34 0 0 1 31.992 13.354 44.33 44.33 0 0 1 12.613 32.289l-.004-.002zm-179.832-77.978c3.339 40.444 5.766 77.33 0 117.641a3.595 3.595 0 0 1-3.573 3.202 3.6 3.6 0 0 1-3.577-3.202c-5.377-39.968-3.034-77.547 0-117.641a3.585 3.585 0 0 1 1.667-3.439 3.619 3.619 0 0 1 3.823 0 3.594 3.594 0 0 1 1.66 3.439zm-22.408 117.681a3.765 3.765 0 0 1-3.725 3.202 3.762 3.762 0 0 1-3.729-3.202 449.585 449.585 0 0 1 0-103.805 3.773 3.773 0 0 1 3.749-3.372 3.778 3.778 0 0 1 3.75 3.372 403.805 403.805 0 0 1-.048 103.805h.003zm-22.455-107.317c3.637 37.059 5.291 70.261-.04 107.232a3.601 3.601 0 0 1-3.598 3.597 3.602 3.602 0 0 1-3.597-3.597c-5.159-36.496-3.427-70.65 0-107.232a3.626 3.626 0 0 1 3.617-3.239 3.63 3.63 0 0 1 3.618 3.239zm-22.488 107.364a3.694 3.694 0 0 1-3.67 3.28 3.675 3.675 0 0 1-3.657-3.28 379.712 379.712 0 0 1 0-96.92 3.728 3.728 0 0 1 7.454 0 354.234 354.234 0 0 1-.132 96.92h.005zm-22.46-72.687c5.681 25.132 3.121 47.33-.213 72.945a3.516 3.516 0 0 1-3.472 2.962 3.514 3.514 0 0 1-3.465-2.962c-3.034-25.265-5.549-47.985-.217-72.953a3.689 3.689 0 0 1 3.684-3.684 3.685 3.685 0 0 1 3.685 3.689l-.002.003zm-22.408-3.817c5.204 25.747 3.512 47.548-.133 73.382-.43 3.817-6.971 3.857-7.321 0-3.295-25.444-4.855-47.897-.133-73.382a3.825 3.825 0 0 1 3.797-3.408 3.806 3.806 0 0 1 3.79 3.408zm-22.621 12.481c5.457 17.078 3.593 30.954-.217 48.46a3.552 3.552 0 0 1-3.532 3.162 3.565 3.565 0 0 1-3.54-3.162c-3.294-17.163-4.629-31.337-.297-48.46a3.803 3.803 0 0 1 3.789-3.407 3.805 3.805 0 0 1 3.79 3.407h.007z"
      />
    </svg>
  );
}

function AppleMusicSVG(className) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      version="1.1"
      x="0px"
      y="0px"
      width="361px"
      height="361px"
      viewBox="0 0 361 361"
      enableBackground={"new 0 0 361 361"}
      xmlSpace="preserve"
      className={className}
    >
      <g>
        <linearGradient
          id="SVGID_1_"
          gradientUnits="userSpaceOnUse"
          x1="180"
          y1="358.6047"
          x2="180"
          y2="7.7586"
        >
          <stop offset="0" stopColor="#FA233B" />
          <stop offset="1" stopColor="#FB5C74" />
        </linearGradient>
        <path
          className="st0"
          fillRule="evenodd"
          clipRule="evenodd"
          fill="url(#SVGID_1_)"
          d="M360,112.61c0-4.3,0-8.6-0.02-12.9c-0.02-3.62-0.06-7.24-0.16-10.86c-0.21-7.89-0.68-15.84-2.08-23.64   c-1.42-7.92-3.75-15.29-7.41-22.49c-3.6-7.07-8.3-13.53-13.91-19.14c-5.61-5.61-12.08-10.31-19.15-13.91   c-7.19-3.66-14.56-5.98-22.47-7.41c-7.8-1.4-15.76-1.87-23.65-2.08c-3.62-0.1-7.24-0.14-10.86-0.16C255.99,0,251.69,0,247.39,0   H112.61c-4.3,0-8.6,0-12.9,0.02c-3.62,0.02-7.24,0.06-10.86,0.16C80.96,0.4,73,0.86,65.2,2.27c-7.92,1.42-15.28,3.75-22.47,7.41   c-7.07,3.6-13.54,8.3-19.15,13.91c-5.61,5.61-10.31,12.07-13.91,19.14c-3.66,7.2-5.99,14.57-7.41,22.49   c-1.4,7.8-1.87,15.76-2.08,23.64c-0.1,3.62-0.14,7.24-0.16,10.86C0,104.01,0,108.31,0,112.61v134.77c0,4.3,0,8.6,0.02,12.9   c0.02,3.62,0.06,7.24,0.16,10.86c0.21,7.89,0.68,15.84,2.08,23.64c1.42,7.92,3.75,15.29,7.41,22.49c3.6,7.07,8.3,13.53,13.91,19.14   c5.61,5.61,12.08,10.31,19.15,13.91c7.19,3.66,14.56,5.98,22.47,7.41c7.8,1.4,15.76,1.87,23.65,2.08c3.62,0.1,7.24,0.14,10.86,0.16   c4.3,0.03,8.6,0.02,12.9,0.02h134.77c4.3,0,8.6,0,12.9-0.02c3.62-0.02,7.24-0.06,10.86-0.16c7.89-0.21,15.85-0.68,23.65-2.08   c7.92-1.42,15.28-3.75,22.47-7.41c7.07-3.6,13.54-8.3,19.15-13.91c5.61-5.61,10.31-12.07,13.91-19.14   c3.66-7.2,5.99-14.57,7.41-22.49c1.4-7.8,1.87-15.76,2.08-23.64c0.1-3.62,0.14-7.24,0.16-10.86c0.03-4.3,0.02-8.6,0.02-12.9V112.61   z"
        />
      </g>
      <g>
        <g>
          <path
            className="st1"
            fillRule="evenodd"
            clipRule="evenodd"
            fill="#fff"
            d="M254.5,55c-0.87,0.08-8.6,1.45-9.53,1.64l-107,21.59l-0.04,0.01c-2.79,0.59-4.98,1.58-6.67,3    c-2.04,1.71-3.17,4.13-3.6,6.95c-0.09,0.6-0.24,1.82-0.24,3.62c0,0,0,109.32,0,133.92c0,3.13-0.25,6.17-2.37,8.76    c-2.12,2.59-4.74,3.37-7.81,3.99c-2.33,0.47-4.66,0.94-6.99,1.41c-8.84,1.78-14.59,2.99-19.8,5.01    c-4.98,1.93-8.71,4.39-11.68,7.51c-5.89,6.17-8.28,14.54-7.46,22.38c0.7,6.69,3.71,13.09,8.88,17.82    c3.49,3.2,7.85,5.63,12.99,6.66c5.33,1.07,11.01,0.7,19.31-0.98c4.42-0.89,8.56-2.28,12.5-4.61c3.9-2.3,7.24-5.37,9.85-9.11    c2.62-3.75,4.31-7.92,5.24-12.35c0.96-4.57,1.19-8.7,1.19-13.26l0-116.15c0-6.22,1.76-7.86,6.78-9.08c0,0,88.94-17.94,93.09-18.75    c5.79-1.11,8.52,0.54,8.52,6.61l0,79.29c0,3.14-0.03,6.32-2.17,8.92c-2.12,2.59-4.74,3.37-7.81,3.99    c-2.33,0.47-4.66,0.94-6.99,1.41c-8.84,1.78-14.59,2.99-19.8,5.01c-4.98,1.93-8.71,4.39-11.68,7.51    c-5.89,6.17-8.49,14.54-7.67,22.38c0.7,6.69,3.92,13.09,9.09,17.82c3.49,3.2,7.85,5.56,12.99,6.6c5.33,1.07,11.01,0.69,19.31-0.98    c4.42-0.89,8.56-2.22,12.5-4.55c3.9-2.3,7.24-5.37,9.85-9.11c2.62-3.75,4.31-7.92,5.24-12.35c0.96-4.57,1-8.7,1-13.26V64.46    C263.54,58.3,260.29,54.5,254.5,55z"
          />
        </g>
      </g>
    </svg>
  );
}
