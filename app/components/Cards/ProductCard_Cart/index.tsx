import { getBucketImageSrc } from "~/integrations/_master/storage";
import { ProductVariantWithDetails } from "~/models/Products/types";

type Props = {
  variant: ProductVariantWithDetails;
  quantity?: number;
};

const ProductCard_Cart = ({ variant, quantity }: Props) => {
  const { product, price, salePrice, isOnSale } = variant || {};
  const { href: imageSrc, altText } = product?.images?.[0] || {};

  return (
    <div
      className="relative flex w-full max-w-full flex-row items-center rounded-lg bg-base-100 p-3"
      key={"cartItem-" + product?.name}
    >
      {imageSrc && (
        <img
          alt={"cartItem_" + altText}
          src={getBucketImageSrc(imageSrc)}
          className="h-20 w-20 rounded-sm border border-base-300 object-cover"
        />
      )}

      {quantity && (
        <div className="relative w-full text-center">
          <div>
            {product?.name} x {quantity}
          </div>
          <div className="text-xs opacity-50">{variant?.name}</div>
          <div className="!rounded-none">
            ${isOnSale ? salePrice?.toFixed(2) : price?.toFixed(2) + " ea"}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCard_Cart;
