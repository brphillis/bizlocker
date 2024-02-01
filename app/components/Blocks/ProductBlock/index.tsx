import Spinner from "~/components/Spinner";
import { BlockOptions, Product } from "@prisma/client";
import ProductGrid from "~/components/Grids/ProductGrid";
import { BlockContentSorted } from "~/models/Blocks/types";
import Title from "../_BlockComponents/Title";
import Container from "../_BlockComponents/Container";
type Props = {
  content: BlockContentSorted[];
  options: BlockOptions[];
};

const ProductBlock = ({ content, options }: Props) => {
  const { title, columns } = options[0] || {};

  const products = content
    .map((e) => e.product as Product)
    .filter((product) => product !== undefined);

  return (
    <Container options={options[0]}>
      <>{title && <Title blockOptions={options[0]} />}</>

      {products && (
        <ProductGrid
          products={products}
          cols={columns || undefined}
          enablePlaceHolder={true}
          extendStyle="!px-0"
        />
      )}

      <>
        {!products && (
          <div className="flex w-full items-center justify-center">
            <Spinner mode="circle" />
          </div>
        )}
      </>
    </Container>
  );
};

export default ProductBlock;
