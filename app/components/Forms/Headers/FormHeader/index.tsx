import type {
  Article,
  ArticleCategory,
  Brand,
  Campaign,
  Product,
  ProductCategory,
  ProductSubCategory,
  Promotion,
  User,
  Image,
  Store,
} from "@prisma/client";
import { useNavigate, useParams } from "@remix-run/react";
import { IoMdTrash } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import Toggle from "~/components/Buttons/Toggle";
import { capitalizeFirst } from "~/helpers/stringHelpers";

type Props = {
  valueToChange?:
    | Promotion
    | Product
    | ProductSubCategory
    | Brand
    | Article
    | ArticleCategory
    | ProductCategory
    | User
    | Campaign
    | Image
    | Store;
  type: string;
  customMode?: string;
  hasIsActive?: boolean;
  hasDelete?: boolean;
  hasConnections?: boolean;
};

const FormHeader = ({
  valueToChange,
  type,
  customMode,
  hasIsActive,
  hasDelete,
}: Props) => {
  const navigate = useNavigate();
  const { id } = useParams() || {};

  let mode = id === "add" ? "add" : "edit";

  if (customMode) {
    mode = customMode;
  }

  const handleActiveStatus = (mode: string): boolean => {
    if (mode === "add") {
      return true;
    }
    if (valueToChange && (valueToChange as any)?.isActive) {
      return true;
    } else return false;
  };

  return (
    <>
      <div className="flex max-w-[100vw] flex-row justify-end sm:justify-between">
        <h1 className="absolute left-3 top-[1.2rem] sm:relative sm:left-0 sm:top-0">
          {mode && capitalizeFirst(mode)} {type}
        </h1>

        <div className="mr-3 flex gap-6 sm:mr-0">
          {hasIsActive && mode && (
            <Toggle defaultValue={handleActiveStatus(mode)} />
          )}
          {hasDelete && (
            <button type="submit" name="_action" value="delete">
              <IoMdTrash />
            </button>
          )}
          <button type="button" className="cursor-pointer">
            <IoClose onClick={() => navigate("..", { replace: true })} />
          </button>
        </div>
      </div>

      <div className="divider my-3 w-full" />
    </>
  );
};

export default FormHeader;
