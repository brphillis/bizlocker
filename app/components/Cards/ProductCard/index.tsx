import { useState } from "react";
import { IoAdd, IoCartOutline, IoRemove } from "react-icons/io5";
import { Form } from "react-router-dom";

const ProductCard = ({ name, images, variants, brand }: Product) => {
  const [quantity, setQuantity] = useState<number>(1);
  const { price } = variants[0] || {};
  const displayImage = images[0]?.url;

  const handleChangeQuantity = (string: "add" | "subtract") => {
    if (string === "add") {
      setQuantity(quantity + 1);
    }
    if (string === "subtract" && quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <Form
      method="POST"
      action="/products"
      className="w-48 rounded-none bg-primary-content shadow lg:w-72"
    >
      <div
        className="bg-fit relative flex h-32 w-full flex-col justify-between bg-gray-200 bg-contain bg-center p-4 lg:h-52"
        style={{
          backgroundImage: `url(${displayImage})`,
        }}
      >
        {brand?.name !== "Generic" && (
          <div className="absolute bottom-0 left-0 right-0 h-max w-full bg-base-300/20">
            <p className="relative left-4 py-2 text-primary-content">
              {brand?.name}
            </p>
          </div>
        )}
      </div>

      <div className="flex flex-col items-center p-2">
        <h1 className="mt-1 text-center text-neutral">{name}</h1>
        <p className="mt-1 text-center text-neutral">${price?.toFixed(2)}</p>
        <div className="mt-2 inline-flex items-center">
          <button
            type="button"
            className="inline-flex items-center rounded-l border border-r border-base-content/40 bg-primary-content px-2 py-1 text-info-content active:bg-base-content/50 disabled:opacity-50"
            onClick={() => handleChangeQuantity("subtract")}
          >
            <IoRemove size={20} className="my-[2px]" />
          </button>
          <div className="inline-flex select-none items-center border-b border-t border-base-content/40 bg-primary-content px-4 py-1 text-info-content">
            {quantity}
          </div>
          <button
            type="button"
            className="inline-flex items-center rounded-r border border-r border-base-content/40 bg-primary-content px-2 py-1 text-info-content active:bg-base-content/50 disabled:opacity-50"
            onClick={() => handleChangeQuantity("add")}
          >
            <IoAdd size={20} className="my-[2px]" />
          </button>
        </div>

        <input
          hidden
          readOnly
          name="variantId"
          value={variants?.[0]?.id || ""}
        />
        <input hidden readOnly name="quantity" value={quantity || ""} />
        <button
          type="submit"
          className="btn-primary btn mt-4 flex w-full items-center justify-center rounded disabled:opacity-50"
        >
          Add to order
          <IoCartOutline size={24} className="ml-3 hidden lg:block" />
        </button>
      </div>
    </Form>
  );
};

export default ProductCard;
