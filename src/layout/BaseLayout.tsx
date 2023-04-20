import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function BaseLayout({ children }: Props) {
  return (
    <>
      <header>{/* TODO: Navigation */}</header>

      <main>{children}</main>

      <footer>
        <div>{/* TODO: light/dark mode switch */}</div>

        <div>{/* TODO: Copyright and GH link */}</div>
      </footer>
    </>
  );
}
