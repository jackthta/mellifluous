type Props = {
  name: string;
  className?: string;
};

export default function SVG({ name, className }: Props) {
  switch (name) {
    case "github":
      return GitHubSVG(className);
    case "search":
      return SearchSVG(className);
  }
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
