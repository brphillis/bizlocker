import { useNavigate } from "@remix-run/react";
import { useEffect, useState } from "react";

type Props = {
  departments: Department[];
  productCategories: ProductCategory[];
};

const DesktopMenu = ({ departments, productCategories }: Props) => {
  const navigate = useNavigate();

  const [selectedDepartment, setSelectedDepartment] = useState<number>(
    departments?.[0].id
  );
  const [activeSubCategories, setActiveSubCategories] = useState<
    { parentCategory: string; subCategories: ProductSubCategory[] } | undefined
  >();

  const [growTimeoutId, setGrowTimeoutId] = useState<NodeJS.Timeout | null>(
    null
  );
  const [shrinkTimeoutId, setShrinkTimeoutId] = useState<NodeJS.Timeout | null>(
    null
  );

  const matchingProductCategories = productCategories.filter(
    (e: ProductCategory) => e.departmentId === selectedDepartment
  );

  const [height, setHeight] = useState<number>(0);
  const [shrinking, setShrinking] = useState<boolean>(false);

  const growSubNav = () => {
    const targetHeight = 50;
    const duration = 450;
    const interval = 10;
    const steps = duration / interval;
    const increment = targetHeight / steps;

    const grow = () => {
      setHeight((prevHeight) => {
        if (prevHeight < targetHeight) {
          const newHeight = prevHeight + increment;
          return newHeight > targetHeight ? targetHeight : newHeight;
        } else {
          return prevHeight;
        }
      });

      if (growTimeoutId) {
        clearTimeout(growTimeoutId);
      }

      if (height < targetHeight) {
        const timeoutId = setTimeout(grow, interval);
        setGrowTimeoutId(timeoutId);
      }
    };

    if (shrinkTimeoutId) {
      clearTimeout(shrinkTimeoutId);
    }
    grow();
  };

  useEffect(() => {
    const shrinkSubNav = () => {
      const targetHeight = 0;
      const duration = 450;
      const interval = 10;
      const steps = duration / interval;
      const decrement = height / steps;

      const shrink = () => {
        setHeight((prevHeight) => {
          if (prevHeight < 1) {
            setActiveSubCategories(undefined);
          }

          if (prevHeight > targetHeight) {
            const newHeight = prevHeight - decrement;
            return newHeight < targetHeight ? targetHeight : newHeight;
          } else {
            return prevHeight;
          }
        });

        if (shrinkTimeoutId) {
          clearTimeout(shrinkTimeoutId);
        }

        if (height > targetHeight) {
          const timeoutId = setTimeout(shrink, interval);
          setShrinkTimeoutId(timeoutId);

          if (!shrinking) {
            setShrinking(true);
          }
        }
      };
      if (growTimeoutId) {
        clearTimeout(growTimeoutId);
      }
      shrink();
    };

    const navigationBar = document.getElementById("NavigationBar");

    if (navigationBar) {
      navigationBar.addEventListener("mouseleave", shrinkSubNav);

      return () => {
        navigationBar.removeEventListener("mouseleave", shrinkSubNav);
      };
    }
  }, [height, shrinking, growTimeoutId, shrinkTimeoutId]);

  return (
    <div className="flex h-max flex-col items-center justify-center">
      <div className="relative hidden h-[60px] xl:block">
        <ul className="menu menu-horizontal h-full items-center !py-0">
          <div className="relative ml-6">
            <select
              name="department"
              className="select mr-6 w-[148px] border-l border-r border-l-white/50 border-r-white/50 bg-brand-black pl-6 pt-[0.125rem] tracking-wider text-brand-white"
              defaultValue={departments?.[0].name.toUpperCase() || ""}
              onChange={(e) => setSelectedDepartment(parseInt(e.target.value))}
            >
              {departments?.map(({ id, name }: Department) => {
                return (
                  <option key={"department_" + id} value={id}>
                    {name.toUpperCase()}
                  </option>
                );
              })}
            </select>
          </div>

          {matchingProductCategories?.map(
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
                      growSubNav();
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

      {activeSubCategories && activeSubCategories.subCategories.length > 0 && (
        <div
          style={{
            height: height + "px",
          }}
          className="relative hidden w-full justify-center xl:flex"
        >
          <ul className="menu menu-horizontal !h-full items-center !py-0">
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
