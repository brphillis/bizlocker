import { useNavigate } from "@remix-run/react";
import { IoChevronForward } from "react-icons/io5";

type Props = {
  productCategoryName: string;
  productSubCategoryName: string;
};

const MobileMenuItem = ({
  productCategoryName,
  productSubCategoryName,
}: Props) => {
  const navigate = useNavigate();
  return (
    <label
      htmlFor="my-drawer-3"
      className="flex items-center justify-between py-3"
      onClick={() =>
        navigate({
          pathname: "/products",
          search: `?productCategory=${productCategoryName}&productSubCategory=${productSubCategoryName}`,
        })
      }
    >
      <label
        htmlFor="my-drawer-3"
        className="pl-3 text-sm font-normal text-brand-white/90"
      >
        {productSubCategoryName}
      </label>
      <IoChevronForward />
    </label>
  );
};

export default MobileMenuItem;
