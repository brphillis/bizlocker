import { useNavigate } from "@remix-run/react";

type Props = {
  productCategories: ProductCategory[];
};

const DesktopMenu = ({ productCategories }: Props) => {
  const navigate = useNavigate();
  return (
    <div className="relative hidden h-full xl:block">
      <ul className="menu menu-horizontal h-full items-center !py-0">
        {productCategories?.map(({ id, name }: ProductCategory) => {
          return (
            <li
              key={"menu_productCategory_" + id}
              className="flex h-full cursor-pointer items-center justify-center border-b-2 border-primary-content/0 px-3 py-3 text-sm font-bold tracking-wide text-brand-white hover:bg-primary-content/10"
              onClick={() =>
                navigate({
                  pathname: "/products",
                  search: `?productCategory=${name}`,
                })
              }
            >
              {name.toUpperCase()}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default DesktopMenu;
