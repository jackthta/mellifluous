import CSS from "./Separator.module.scss";

type Props = {
  inSearch?: boolean;
};

export default function Separator({ inSearch }: Props) {
  return (
    <hr className={`${CSS.separator} ${inSearch && CSS.inSearchSeparator}`} />
  );
}
