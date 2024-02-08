import React, { useState } from "react";
import { User } from "@prisma/client";
import { DepartmentWithDetails } from "~/models/Departments/types";
import { ProductCategoryWithDetails } from "~/models/ProductCategories/types";
import MenuFooter from "./MenuFooter";
import MenuDropdown from "./MenuDropdown";

type Props = {
  departments: DepartmentWithDetails[];
  productCategories: ProductCategoryWithDetails[];
  user: User | null;
};

const ProductBasicMobile = ({
  departments,
  productCategories,
  user,
}: Props) => {
  const [selectedDepartment, setSelectedDepartment] = useState<number>(
    departments?.[0].id,
  );

  const matchingProductCategories = productCategories.filter(
    (e: ProductCategoryWithDetails) => e.departmentId === selectedDepartment,
  );

  return (
    <div className="drawer-side">
      {/* eslint-disable */}
      <label
        htmlFor="mobile-navigation-state"
        className="drawer-overlay"
      ></label>
      {/* eslint-enable */}
      <ul className="z-100 menu relative !h-[100dvh] w-64 bg-brand-black p-4 text-brand-white">
        <div className="mx-auto block">
          <h1 className="cursor-pointer select-none text-3xl font-bold tracking-widest text-white mt-3">
            CLUTCH.
          </h1>
          <p className="mt-1 text-center text-xs">clothing co.</p>
        </div>

        {departments && departments.length > 1 ? (
          <select
            name="department"
            className="select mx-auto my-6 w-full border-l border-r border-white/10 bg-brand-black pt-[0.125rem] tracking-wider text-brand-white"
            defaultValue={departments?.[0].name.toUpperCase() || ""}
            onChange={(e) => setSelectedDepartment(parseInt(e.target.value))}
          >
            {departments.map(
              ({ id, name, displayInNavigation }: DepartmentWithDetails) => {
                if (displayInNavigation) {
                  return (
                    <option key={"department_" + id} value={id}>
                      {name.toUpperCase()}
                    </option>
                  );
                } else return null;
              },
            )}
          </select>
        ) : (
          <div className="my-3"></div>
        )}

        <div className="relative max-h-[67dvh] overflow-y-auto">
          {matchingProductCategories.map(
            ({
              displayInNavigation,
              id,
              name,
              productSubCategories,
            }: ProductCategoryWithDetails) => {
              if (displayInNavigation) {
                return (
                  <React.Fragment key={"mobileMenu_Dropdown_" + id}>
                    <MenuDropdown
                      id={id}
                      name={name}
                      productSubCategories={productSubCategories}
                    />
                  </React.Fragment>
                );
              } else return null;
            },
          )}
        </div>

        <MenuFooter user={user} />
      </ul>
    </div>
  );
};

export default ProductBasicMobile;
