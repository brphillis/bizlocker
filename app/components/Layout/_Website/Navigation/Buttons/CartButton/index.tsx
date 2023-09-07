import { IoCartOutline, IoClose } from "react-icons/io5";
import { useEffect, useRef, useState } from "react";
import { Form, useNavigate } from "react-router-dom";
import CartAddSubtractButton from "./CartAddSubtractButton";
import {
  calculateCartTotal,
  getVariantUnitPrice,
} from "~/utility/numberHelpers";

const CartButton = ({ id: cartId, cartItems }: Cart) => {
  const navigate = useNavigate();
  const cartModalRef = useRef<HTMLDivElement | null>(null);

  const [totalPrice, setTotalPrice] = useState<number>(0);

  const handleOpen = () => {
    if (cartModalRef.current) {
      cartModalRef.current.focus();
    }
  };

  const handleClose = () => {
    if (cartModalRef.current) {
      cartModalRef.current.blur();
    }
  };

  useEffect(() => {
    const total = calculateCartTotal(cartItems);
    setTotalPrice(total);
  }, [cartItems]);

  return (
    <div className="dropdown dropdown-end relative">
      <label
        tabIndex={0}
        onClick={handleOpen}
        className="relative cursor-pointer marker:h-20"
      >
        {cartItems?.length > 0 && (
          <div className="absolute right-[-6px] top-[-6px] flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
            {cartItems?.length}
          </div>
        )}
        <IoCartOutline size={24} className="text-brand-white" />
      </label>

      {/* CART MODAL */}
      <div
        ref={cartModalRef}
        tabIndex={0}
        className="dropdown-content z-10 mr-2 mt-4 w-max min-w-[300px] overflow-hidden rounded-md border-2 border-base-200/75 bg-base-100 shadow-xl"
      >
        <IoClose
          onClick={handleClose}
          className="
          absolute right-2 top-2
          cursor-pointer
          rounded-full bg-primary p-[0.2rem] text-white"
        />

        <Form method="POST" className="mb-6 flex flex-col gap-3">
          <div className="mt-3 text-center font-bold">Your Cart</div>
          <ul className="mb-12">
            {cartItems
              ?.sort((a, b) =>
                a.variant.product.name.localeCompare(b.variant.product.name)
              )
              .reverse()
              .map(({ variant, quantity }: CartItem, index) => {
                const { product, id: variantId } = variant;

                return (
                  <div
                    key={"cartButton_item_" + variant + "_" + index}
                    className="relative mx-3 mb-1 flex flex-col items-center justify-center gap-1 border border-base-300 bg-base-200/50 px-3 py-3 text-brand-black"
                  >
                    {variantId && (
                      <CartAddSubtractButton
                        mode="subtract"
                        variantId={variantId?.toString()}
                        extendStyle="absolute left-8"
                      />
                    )}

                    <div>{product?.name}</div>

                    <div className="flex flex-row gap-3">
                      <div>${getVariantUnitPrice(variant, product)}</div>
                      <div> x {quantity}</div>
                    </div>

                    {variantId && (
                      <CartAddSubtractButton
                        mode="add"
                        variantId={variantId?.toString()}
                        extendStyle="absolute right-8"
                      />
                    )}
                  </div>
                );
              })}

            <input name="cartId" value={cartId || ""} readOnly hidden />

            <div className="mt-4 text-center">
              Order Total: ${totalPrice.toFixed(2)}
            </div>
            <div className="mb-0 text-center text-[12px] text-base-content">
              inc GST - ex Delivery
            </div>
          </ul>

          <div className="absolute bottom-0 left-1/2 my-3 flex w-full translate-x-[-50%] flex-col gap-1 px-3">
            <button
              type="button"
              className="lg btn-md relative bottom-[-1px] bg-primary pr-4 font-bold tracking-wide !text-white"
              onClick={() => navigate(`/cart`)}
            >
              Buy Now
            </button>
          </div>
        </Form>
      </div>
      {/* CART MODAL */}
    </div>
  );
};

export default CartButton;
