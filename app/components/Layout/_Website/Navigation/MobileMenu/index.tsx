import { useNavigate, useSubmit } from "@remix-run/react";
import { IoChevronForward, IoLogOutOutline, IoMenu } from "react-icons/io5";

type Props = {
  productCategories: ProductCategory[];
  user: User;
};

const MobileNavigation = ({ productCategories, user }: Props) => {
  const navigate = useNavigate();
  const submit = useSubmit();
  return (
    <div className="drawer-side">
      <label htmlFor="my-drawer-3" className="drawer-overlay"></label>
      <ul className="z-100 menu min-h-[100vh] w-64 bg-brand-black p-4 text-brand-white">
        <div className="mx-auto mb-12 block">
          <h1 className="cursor-pointer select-none text-3xl font-bold tracking-widest text-white">
            CLUTCH.
          </h1>
          <p className="text-center text-xs">clothing co.</p>
        </div>
        {productCategories?.map(
          ({ id, name, productSubCategories }: ProductCategory) => {
            return (
              <li
                key={"mobileMenu_productCategory_" + id}
                className="cursor-pointer border-b-2 border-primary-content/0 px-3 text-sm font-bold tracking-wide !opacity-100"
              >
                <div className="collapse !visible w-full !auto-cols-auto !gap-0 !p-0">
                  <input type="checkbox" className="peer absolute top-0" />
                  <div className="relative flex w-full items-center justify-between py-3 peer-checked:text-primary">
                    <div className="text-sm font-semibold">{name}</div>
                    <IoMenu />
                  </div>
                  <div className="collapse-content">
                    {productSubCategories?.map(
                      ({ name: subCatName }: ProductSubCategory, i: number) => {
                        return (
                          <div
                            key={"mobileMenu_productSubCategory" + i}
                            className="flex justify-between py-3"
                            onClick={() =>
                              navigate({
                                pathname: "/products",
                                search: `?productCategory=${name}&productSubCategory=${subCatName}`,
                              })
                            }
                          >
                            <label
                              htmlFor="my-drawer-3"
                              className="pl-3 text-sm font-normal"
                            >
                              {subCatName}
                            </label>
                            <IoChevronForward />
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              </li>
            );
          }
        )}
        {user && (
          <div
            className={
              "absolute bottom-4 right-4 flex items-center justify-center font-bold"
            }
            onClick={() => submit(null, { method: "post", action: "/logout" })}
          >
            <IoLogOutOutline size={24} />
          </div>
        )}
      </ul>
    </div>
  );
};

export default MobileNavigation;
