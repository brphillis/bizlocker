import { useEffect, useRef, useState } from "react";
import { Form, useNavigate } from "react-router-dom";
import { IoCartOutline, IoClose } from "react-icons/io5";
import { CartItemWithDetails, CartWithDetails } from "~/models/Cart/types";
import {
  calculateCartTotal,
  getVariantUnitPrice,
} from "~/helpers/numberHelpers";
import CartAddSubtractButton from "./CartAddSubtractButton";
import { getBucketImageSrc } from "~/integrations/_master/storage";

const CartButton = ({ id: cartId, cartItems }: CartWithDetails) => {
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
    if (cartItems) {
      const total = calculateCartTotal(cartItems);
      setTotalPrice(total);
    }
  }, [cartItems]);

  return (
    <div className="dropdown dropdown-end relative">
      {/* eslint-disable */}
      <label
        tabIndex={0}
        onClick={handleOpen}
        className="relative cursor-pointer marker:h-20"
      >
        {cartItems && cartItems?.length > 0 && (
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
        className="dropdown-content z-50 mr-2 mt-4 max-md:mr-0 w-max min-w-[300px] overflow-hidden rounded-md border-2 border-base-200/75 bg-base-100 shadow-xl"
      >
        <IoClose
          onClick={handleClose}
          className="
          absolute right-2 top-2
          cursor-pointer
          rounded-full bg-primary p-[0.2rem] text-white hover:bg-primary-dark"
        />

        <Form method="POST" className="mb-6 flex flex-col gap-3">
          <div className="mt-3 text-center font-bold">Your Cart</div>
          <ul className="mb-12">
            <div className="max-h-[400px] overflow-y-auto">
              {cartItems?.map(
                ({ variant, quantity }: CartItemWithDetails, index) => {
                  const { product, id: variantId, name } = variant || {};
                  const { href: imageSrc, altText } =
                    product?.images?.[0] || {};

                  return (
                    <div
                      key={"cartButton_item_" + variant + "_" + index}
                      className="relative mx-3 mb-1 flex flex-col items-center justify-center gap-1 rounded-sm border border-base-300 bg-base-200/50 px-3 py-3 text-brand-black"
                    >
                      {imageSrc && (
                        <img
                          alt={"cartItem_" + altText}
                          src={getBucketImageSrc(imageSrc)}
                          className="h-20 w-20 cursor-pointer rounded-sm border border-base-300 object-cover"
                          onClick={() =>
                            navigate(
                              `/product/${product?.name}?id=${product?.id}`,
                            )
                          }
                        />
                      )}

                      {variantId && (
                        <CartAddSubtractButton
                          mode="subtract"
                          variantId={variantId?.toString()}
                          extendStyle="absolute left-8 top-10"
                        />
                      )}

                      <div
                        className="cursor-pointer hover:font-semibold"
                        onClick={() =>
                          navigate(
                            `/product/${product?.name}?id=${product?.id}`,
                          )
                        }
                      >
                        {product?.name}
                      </div>

                      <div className="text-xs opacity-50">{name}</div>

                      <div className="flex flex-row gap-3">
                        <div>
                          $
                          {variant &&
                            product &&
                            getVariantUnitPrice(variant, product)}
                        </div>
                        <div> x {quantity}</div>
                      </div>

                      {variantId && (
                        <CartAddSubtractButton
                          mode="add"
                          variantId={variantId?.toString()}
                          extendStyle="absolute right-8 top-10"
                        />
                      )}
                    </div>
                  );
                },
              )}
            </div>

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
              className="w-full ml-auto text-center tracking-wider border-0 bg-brand-green hover:scale-[1.01] transition-all duration-300 ease-in-out font-bold px-3 py-3 rounded-full text-white disabled:opacity-50 max-sm:order-2"
              onClick={() => navigate(`/cart`)}
            >
              BUY NOW
            </button>
          </div>
        </Form>
      </div>
      {/* eslint-enable */}
    </div>
  );
};

export default CartButton;
