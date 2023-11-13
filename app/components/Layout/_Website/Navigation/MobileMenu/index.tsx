import React, { useState } from "react";
import MobileMenuDropdown from "./MobileMenuDropdown";
import MobileMenuFooter from "./MobileMenuFooter";

type Props = {
  departments: Department[];
  productCategories: ProductCategory[];
  user: User;
};

const MobileNavigation = ({ departments, productCategories, user }: Props) => {
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
                  <React.Fragment key={"mobileMenu_Dropdown_" + id}>
                    <MobileMenuDropdown
                      id={id}
                      name={name}
                      productSubCategories={productSubCategories}
                    />
                  </React.Fragment>
                );
              } else return null;
            }
          )}
        </div>

        <MobileMenuFooter user={user} />
      </ul>
    </div>
  );
};

export default MobileNavigation;
