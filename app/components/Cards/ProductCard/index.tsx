import { useNavigate, useSubmit } from "@remix-run/react";
import { IoCart } from "react-icons/io5";
import { Toast } from "~/components/Notifications/Toast";
import { getVariantUnitPrice } from "~/utility/numberHelpers";

const ProductCard = (product: Product) => {
  const submit = useSubmit();
  const navigate = useNavigate();

  const { id, name, images, variants, brand } = product;

  const { id: variantId, price, isOnSale, isPromoted } = variants[0] || {};
  const displayImage = images[0]?.url;

  const handleAddToCart = () => {
    if (variantId) {
      const formData = new FormData();
      formData.set("variantId", variantId.toString());
      formData.set("quantity", "1");

      submit(formData, {
        method: "POST",
        action: "/products",
        preventScrollReset: true,
        replace: true,
      });
    }

    Toast("success", 2000, "Item Added");
  };

  return (
    <div className="group flex w-full flex-col overflow-hidden bg-brand-white">
      <div
        className="relative flex h-60 w-full max-w-full cursor-pointer overflow-hidden sm:h-72"
        onClick={() => navigate(`/product/${name}?id=${id}`)}
      >
        <img
          className="absolute right-0 top-0 h-full w-full transform object-cover hover:scale-[1.025]"
          src={displayImage}
          alt={name.toLowerCase() + " product card"}
        />
        {isOnSale && (
          <span className="absolute left-2 top-2 mr-2 bg-red-500 px-2 py-1 text-xs text-brand-white opacity-30">
            SALE
          </span>
        )}

        {isPromoted && (
          <span className="absolute left-2 top-2 mr-2 bg-green-500 px-2 py-1 text-xs text-brand-white opacity-30">
            PROMO
          </span>
        )}
        <div className="absolute bottom-0 mb-4 flex w-full justify-center space-x-4">
          <div className="h-3 w-3 rounded-full border-2 border-brand-white bg-white"></div>
          <div className="h-3 w-3 rounded-full border-2 border-brand-white bg-transparent"></div>
          <div className="h-3 w-3 rounded-full border-2 border-brand-white bg-transparent"></div>
        </div>
        <div className="absolute bottom-0 right-0 mb-4 mr-2 space-y-2 transition-all duration-300 group-hover:right-0">
          {/* <button className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-900 text-white transition hover:bg-gray-700">
            <IoHeart size={18} />
          </button> */}
          <button
            className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-black text-brand-white transition hover:bg-gray-700"
            onClick={handleAddToCart}
          >
            <IoCart size={18} />
          </button>
        </div>
      </div>
      <div className="mt-2 text-left">
        {brand && brand.name !== "Generic" && (
          <h5 className="font-semibold tracking-tight text-gray-500">
            {brand.name}
          </h5>
        )}
        <h5 className="tracking-tight text-gray-500">{name}</h5>

        <div>
          <p>
            {isOnSale && (
              <>
                <span className="mr-2 text-sm text-gray-400 line-through">
                  ${price.toFixed(2)}
                </span>
              </>
            )}

            {isPromoted && (
              <>
                <span className="mr-2 text-sm text-gray-400 line-through">
                  ${price.toFixed(2)}
                </span>
              </>
            )}
            <span className="text-sm font-bold text-gray-900">
              ${getVariantUnitPrice(variants[0], product)}&nbsp;
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
