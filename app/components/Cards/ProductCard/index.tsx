import { useSubmit } from "@remix-run/react";
import { IoCart } from "react-icons/io5";

const ProductCard = ({ name, images, variants, brand }: Product) => {
  const submit = useSubmit();
  const { id, price, isOnSale, salePrice } = variants[0] || {};
  const displayImage = images[0]?.url;

  const handleAddToCart = () => {
    if (id) {
      const formData = new FormData();
      formData.set("variantId", id.toString());
      formData.set("quantity", "1");

      submit(formData, { method: "POST", action: "/products" });
    }
  };

  return (
    <div className="group flex w-48 max-w-[48vw] flex-col overflow-hidden bg-white sm:w-56">
      <div className="relative flex h-64 w-full max-w-full overflow-hidden sm:h-72">
        <img
          className="absolute right-0 top-0 h-full w-full object-cover"
          src={displayImage}
          alt="product"
        />
        <div className="absolute bottom-0 mb-4 flex w-full justify-center space-x-4">
          <div className="h-3 w-3 rounded-full border-2 border-white bg-white"></div>
          <div className="h-3 w-3 rounded-full border-2 border-white bg-transparent"></div>
          <div className="h-3 w-3 rounded-full border-2 border-white bg-transparent"></div>
        </div>
        <div className="absolute bottom-0 right-0 mb-4 mr-2 space-y-2 transition-all duration-300 group-hover:right-0">
          {/* <button className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-900 text-white transition hover:bg-gray-700">
            <IoHeart size={18} />
          </button> */}
          <button
            className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-black text-white transition hover:bg-gray-700"
            onClick={handleAddToCart}
          >
            <IoCart size={18} />
          </button>
        </div>
      </div>
      <div className="mt-2 text-left">
        {brand && (
          <h5 className="font-semibold tracking-tight text-gray-500">
            {brand.name}
          </h5>
        )}
        <h5 className="tracking-tight text-gray-500">{name}</h5>

        <div className="mb-5">
          <p>
            <span className="text-sm font-bold text-gray-900">
              ${isOnSale ? salePrice.toFixed(2) : price.toFixed(2)}&nbsp;
            </span>
            {isOnSale && (
              <>
                <span className="text-sm text-gray-400 line-through">
                  ${price.toFixed(2)}
                </span>
                <span className="ml-1 text-sm text-gray-400">SALE</span>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
