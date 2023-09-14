import { useNavigate } from "@remix-run/react";
import { useState } from "react";
import { IoMdTrash } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { capitalizeFirst } from "~/utility/stringHelpers";

type Props = {
  valueToChange:
    | Promotion
    | Product
    | ProductSubCategory
    | Brand
    | Article
    | ArticleCategory
    | ProductCategory
    | User
    | Campaign
    | Image;
  type:
    | "Promotion"
    | "Department"
    | "Product"
    | "Brand"
    | "Article"
    | "Category"
    | "User"
    | "Campaign"
    | "Image";
  mode: "add" | "edit";
  hasIsActive?: boolean;
  hasDelete?: boolean;
  hasConnections?: boolean;
};

const FormHeader = ({
  valueToChange,
  type,
  mode,
  hasIsActive,
  hasDelete,
}: Props) => {
  const navigate = useNavigate();

  const [isActive, setIsActive] = useState<string | undefined>(
    mode === "add"
      ? " "
      : "isActive" in valueToChange && valueToChange?.isActive
      ? " "
      : ""
  );

  return (
    <>
      <div className="flex max-w-[100vw] flex-row justify-end sm:justify-between">
        <h1 className="absolute left-0 top-[1.2rem] sm:relative sm:top-0">
          {mode && capitalizeFirst(mode)} {type}
        </h1>

        <div className="mr-3 flex gap-6 sm:mr-0">
          {hasIsActive && (
            <>
              <label className="max-xs:mt-0 label relative mt-[5px] h-1 cursor-pointer">
                <input
                  type="checkbox"
                  className="toggle toggle-sm ml-3"
                  checked={isActive ? true : false}
                  onChange={(e) =>
                    setIsActive(e.target.checked ? "true" : undefined)
                  }
                />
                <span className="label-text ml-3">Active</span>
              </label>
              <input name="isActive" value={isActive || ""} readOnly hidden />
            </>
          )}
          {hasDelete && (
            <button type="submit" name="_action" value="delete">
              <IoMdTrash />
            </button>
          )}
          <button type="button" className="cursor-pointer">
            <IoClose onClick={() => navigate("..")} />
          </button>
        </div>
      </div>

      <div className="divider my-3 w-full" />
    </>
  );
};

export default FormHeader;
