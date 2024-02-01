import { useNavigate } from "@remix-run/react";
import { IoChevronForward } from "react-icons/io5";

type Props = {
  productCategoryName: string;
  productSubCategoryName: string;
};

const MenuItem = ({ productCategoryName, productSubCategoryName }: Props) => {
  const navigate = useNavigate();
  {
    /* eslint-disable */
  }
  return (
    <label
      htmlFor="mobile-navigation-state"
      className="flex items-center justify-between py-3"
      onClick={() =>
        navigate({
          pathname: "/products",
          search: `?productCategory=${productCategoryName}&productSubCategory=${productSubCategoryName}`,
        })
      }
    >
      <label
        htmlFor="mobile-navigation-state"
        className="pl-3 text-sm font-normal text-brand-white/90"
      >
        {productSubCategoryName}
      </label>
      <IoChevronForward />
    </label>
  );
  {
    /* eslint-enable */
  }
};

export default MenuItem;
