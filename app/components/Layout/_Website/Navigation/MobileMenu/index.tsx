import { useNavigate, useSubmit } from "@remix-run/react";
import { useState } from "react";
import { IoChevronForward, IoLogOutOutline } from "react-icons/io5";

type Props = {
  departments: Department[];
  productCategories: ProductCategory[];
  user: User;
};

const MobileNavigation = ({ departments, productCategories, user }: Props) => {
  const navigate = useNavigate();
  const submit = useSubmit();

  const [selectedDepartment, setSelectedDepartment] = useState<number>(
    departments?.[0].id
  );

  const matchingProductCategories = productCategories.filter(
    (e: ProductCategory) => e.departmentId === selectedDepartment
  );

  return (
    <div className="drawer-side">
      <label htmlFor="my-drawer-3" className="drawer-overlay"></label>
      <ul className="z-100 menu relative !h-[100dvh] w-64 bg-brand-black p-4 text-brand-white">
        <div className="mx-auto mb-1 block">
          <h1 className="cursor-pointer select-none text-3xl font-bold tracking-widest text-white">
            CLUTCH.
          </h1>
          <p className="mt-1 text-center text-xs">clothing co.</p>
        </div>

        <select
          name="department"
          className="select mx-auto my-6 w-full border-l border-r border-white/10 bg-brand-black pt-[0.125rem] tracking-wider text-brand-white"
          defaultValue={departments?.[0].name.toUpperCase() || ""}
          onChange={(e) => setSelectedDepartment(parseInt(e.target.value))}
        >
          {departments.map(({ id, name, displayInNavigation }: Department) => {
            if (displayInNavigation) {
              return (
                <option key={"department_" + id} value={id}>
                  {name.toUpperCase()}
                </option>
              );
            } else return null;
          })}
        </select>

        <div className="relative max-h-[67dvh] overflow-y-auto">
          {matchingProductCategories.map(
            ({
              displayInNavigation,
              id,
              name,
              productSubCategories,
            }: ProductCategory) => {
              if (displayInNavigation) {
                return (
                  <li
                    key={"mobileMenu_productCategory_" + id}
                    className="cursor-pointer border-b-2 border-primary-content/0 px-3 text-sm font-bold tracking-wide !opacity-100"
                  >
                    <div className="collapse !visible w-full !auto-cols-auto !gap-0 !p-0">
                      <input type="checkbox" className="peer absolute top-0" />
                      <div className="relative flex w-full items-center justify-between py-3 text-sm font-semibold peer-checked:mb-2 peer-checked:border-b peer-checked:border-b-white/10 peer-checked:pl-2">
                        {name}
                      </div>
                      <div className="collapse-content">
                        {productSubCategories?.map(
                          (
                            {
                              name: subCatName,
                              displayInNavigation: displaySubCat,
                            }: ProductSubCategory,
                            i: number
                          ) => {
                            if (displaySubCat) {
                              return (
                                <label
                                  key={"mobileMenu_productSubCategory" + i}
                                  htmlFor="my-drawer-3"
                                  className="flex items-center justify-between py-3"
                                  onClick={() =>
                                    navigate({
                                      pathname: "/products",
                                      search: `?productCategory=${name}&productSubCategory=${subCatName}`,
                                    })
                                  }
                                >
                                  <label
                                    htmlFor="my-drawer-3"
                                    className="pl-3 text-sm font-normal text-brand-white/90"
                                  >
                                    {subCatName}
                                  </label>
                                  <IoChevronForward />
                                </label>
                              );
                            } else return null;
                          }
                        )}
                      </div>
                    </div>
                  </li>
                );
              } else return null;
            }
          )}
        </div>

        {user && (
          <div
            className={"absolute bottom-0 left-0 right-0 w-full px-4 font-bold"}
            onClick={() => submit(null, { method: "post", action: "/logout" })}
          >
            <div className="flex flex-row justify-between border-t border-white/25 px-3 py-4">
              <p className="text-xs text-brand-white">terms & conditions</p>
              <IoLogOutOutline size={20} />
            </div>
          </div>
        )}
      </ul>
    </div>
  );
};

export default MobileNavigation;
