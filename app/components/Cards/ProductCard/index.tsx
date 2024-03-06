import { useEffect, useState } from "react";
import { IoCart } from "react-icons/io5";
import Spinner from "~/components/Spinner";
import BasicImage from "~/components/Client/BasicImage";
import { Toast } from "~/components/Notifications/Toast";
import { ProductWithDetails } from "~/models/Products/types";
import { getVariantUnitPrice } from "~/helpers/numberHelpers";
import { useNavigation, useSubmit } from "@remix-run/react";

const ProductCard = (product: ProductWithDetails) => {
  const submit = useSubmit();
  const navigation = useNavigation();

  const { id, name, images, variants, brand, promotion } = product;

  const { id: variantId, price, isOnSale, isPromoted } = variants?.[0] || {};
  const displayImage = images?.[0]?.href;

  const [loading, setLoading] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleAddToCart = () => {
    setLoading(true);
    if (variantId) {
      const formData = new FormData();
      formData.set("variantId", variantId.toString());
      formData.set("quantity", "1");

      submit(formData, {
        method: "POST",
        action: "/products",
        preventScrollReset: true,
      });
    }
  };

  useEffect(() => {
    if (location && loading) {
      if (navigation.state === "submitting") {
        setSubmitted(true);
      }

      if (submitted && navigation.state === "idle") {
        Toast("success", 3000, "Item Added");

        setLoading(false);
        setSubmitted(false);
      }
    }
  }, [navigation, loading, submitted]);

  return (
    <>
      <div className="group flex w-full flex-col overflow-hidden bg-brand-white">
        {/* IMAGE */}
        <div className="relative flex max-sm:h-60 max-md:h-[300px] w-full max-w-full cursor-pointer overflow-hidden shadow-sm h-72">
          {displayImage && (
            <BasicImage
              extendStyle="absolute right-0 top-0 h-full w-full transform object-cover"
              src={displayImage}
              alt={name.toLowerCase() + " product card"}
              link={`/product/${name}?id=${id}`}
              hoverEffect="grow"
            />
          )}

          {isOnSale && (
            <span className="absolute left-2 top-2 mr-2 bg-red-500 px-2 py-1 text-xs text-brand-white opacity-75">
              SALE
            </span>
          )}

          {promotion && isPromoted && promotion?.isActive && (
            <span className="absolute left-2 top-2 mr-2 bg-green-500 px-2 py-1 text-xs text-brand-white opacity-75">
              PROMO
            </span>
          )}

          <div className="absolute -bottom-2 right-0 mb-4 mr-2 space-y-2 transition-all duration-300 group-hover:right-0">
            <button
              className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-black text-brand-white transition hover:bg-gray-700 border border-white/25"
              onClick={handleAddToCart}
            >
              <IoCart size={18} />
            </button>
          </div>
        </div>

        {/* INFO BELOW */}

        <div className="mt-2 text-left">
          {brand && brand.name.toLowerCase() !== "generic" && (
            <h5 className="font-semibold tracking-tight text-gray-500">
              {brand.name}
            </h5>
          )}
          <h5 className="tracking-tight text-gray-500">{name}</h5>

          <div>
            <p>
              {(isOnSale || (promotion && isPromoted)) && (
                <span className="mr-2 text-sm text-gray-400 line-through">
                  ${price?.toFixed(2)}
                </span>
              )}
              <span className="text-sm font-bold text-gray-900">
                ${variants && getVariantUnitPrice(variants[0], product)}
                &nbsp;<span className="opacity-25">AUD</span>
              </span>
            </p>
          </div>
        </div>
      </div>

      {loading && (
        <div className="fixed bottom-3 right-3 z-50">
          <Spinner mode="circle" />
        </div>
      )}
    </>
  );
};

export default ProductCard;
