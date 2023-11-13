import { useNavigate } from "@remix-run/react";
import { capitalizeFirst } from "~/helpers/stringHelpers";

type Props = {
  name: string;
  link?: string;
};

const SidebarDropdownChild = ({ link, name }: Props) => {
  const navigate = useNavigate();
  return (
    <li onClick={() => link && navigate(link)}>
      <label htmlFor="my-drawer-2" className="hover:text-white">
        {capitalizeFirst(name)}
      </label>
    </li>
  );
};

export default SidebarDropdownChild;
