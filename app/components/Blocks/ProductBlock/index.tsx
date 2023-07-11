import { useFetcher } from "@remix-run/react";
import { useEffect } from "react";

type Props = {
  content: ProductBlockContent;
  options: BlockOptions;
};

const ProductBlock = ({ content, options }: Props) => {
  const fetcher = useFetcher();

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data == null) {
      fetcher.load("/api/productSearch");
    }
    console.log(fetcher);
  }, [fetcher]);

  return (
    <button onClick={() => fetcher.load("/api/productSearch")}>
      PRODUCT BLOCK
    </button>
  );
};

export default ProductBlock;
