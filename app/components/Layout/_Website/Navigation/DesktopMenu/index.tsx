import { useNavigate } from "@remix-run/react";
import { useEffect, useState } from "react";

type Props = {
  productCategories: ProductCategory[];
};

const DesktopMenu = ({ productCategories }: Props) => {
  const navigate = useNavigate();

  const [activeSubCategories, setActiveSubCategories] = useState<
    { parentCategory: string; subCategories: ProductSubCategory[] } | undefined
  >();

  useEffect(() => {
    const navBar = document.getElementById("NavigationBar");

    const handleMouseLeave = () => {
      setTimeout(() => {
        setActiveSubCategories(undefined);
      }, 2000);
    };

    navBar?.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      navBar?.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div className="m-0 flex h-max flex-col items-center justify-center p-0">
      <div className="relative hidden h-[60px] xl:block">
        <ul className="menu menu-horizontal h-full items-center !py-0">
          {productCategories?.map(
            ({ id, name, productSubCategories }: ProductCategory) => {
              return (
                <li
                  key={"menu_productCategory_" + id}
                  className={`flex h-full cursor-pointer items-center justify-center px-3 py-3 text-sm font-bold tracking-wide text-brand-white hover:bg-primary-content/10 
                  ${
                    activeSubCategories?.parentCategory === name &&
                    "border-b-2 border-b-brand-white"
                  }`}
                  onClick={() =>
                    navigate({
                      pathname: "/products",
                      search: `?productCategory=${name}`,
                    })
                  }
                  onMouseOver={() => {
                    if (productSubCategories) {
                      setActiveSubCategories({
                        parentCategory: name,
                        subCategories: productSubCategories,
                      });
                    }
                  }}
                >
                  {name.toUpperCase()}
                </li>
              );
            }
          )}
        </ul>
      </div>

      {activeSubCategories && (
        <div className="relative hidden h-[50px] w-full justify-center xl:flex">
          <ul className="menu menu-horizontal h-full items-center !py-0">
            {activeSubCategories?.subCategories.map(
              ({ id, name }: ProductSubCategory) => {
                return (
                  <li
                    key={"menu_productSubCategory_" + id}
                    className="flex h-full cursor-pointer items-center justify-center border-primary-content/0 px-3 py-1 text-sm font-semibold tracking-wide text-brand-white hover:bg-primary-content/10"
                    onClick={() =>
                      navigate({
                        pathname: "/products",
                        search: `?productCategory=${activeSubCategories.parentCategory}&productSubCategory=${name}`,
                      })
                    }
                  >
                    {name.toUpperCase()}
                  </li>
                );
              }
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DesktopMenu;
