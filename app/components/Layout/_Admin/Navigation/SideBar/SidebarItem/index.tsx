import { useNavigate } from "@remix-run/react";
import Icon from "~/components/Icon";
import type * as IconsIO5 from "react-icons/io5";

const SidebarItem = ({ icon, link, name }: NavigationRouteItem) => {
  const navigate = useNavigate();
  return (
    // eslint-disable-next-line
    <div
      onClick={() => link && navigate(link)}
      className="flex h-[60px] w-full cursor-pointer items-center gap-3 pl-4"
    >
      <Icon iconName={icon as keyof typeof IconsIO5} size={18} />
      <p className="select-none transition duration-500 ease-in-out hover:scale-[1.03]">
        {name}
      </p>
    </div>
  );
};

export default SidebarItem;
