import { IoCartOutline } from "react-icons/io5";
import { useEffect, useState } from "react";
import { Form, useNavigate } from "react-router-dom";
import CartAddSubtractButton from "./CartAddSubtractButton";

const CartButton = ({ id: cartId, cartItems }: Cart) => {
  const navigate = useNavigate();

  const [totalPrice, setTotalPrice] = useState<number>(0);

  useEffect(() => {
    const calcTotal = () => {
      let total = 0;
      cartItems.forEach((e) => {
        if (e.variant.price) total += e.variant.price * e.quantity;
      });

      setTotalPrice(total);
    };

    calcTotal();
  }, [cartItems]);

  return (
    <div className="dropdown-end dropdown relative z-10">
      <label tabIndex={0} className="relative cursor-pointer marker:h-20">
        {cartItems?.length > 0 && (
          <div className="absolute right-[-6px] top-[-6px] flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
            {cartItems?.length}
          </div>
        )}
        <IoCartOutline size={24} className="text-brand-white" />
      </label>

      {/* CART MODAL */}
      <div
        tabIndex={0}
        className="dropdown-content mr-3 mt-3 w-max min-w-[300px] overflow-hidden rounded-none bg-base-100 shadow"
      >
        <Form method="POST" className="mb-6 flex flex-col gap-3">
          <div className="mt-3 text-center font-bold">Your Cart</div>
          <ul className="mb-12">
            {cartItems
              ?.sort((a, b) =>
                a.variant.product.name.localeCompare(b.variant.product.name)
              )
              .reverse()
              .map(({ variant, quantity }: CartItem, index) => {
                const {
                  product,
                  price,
                  salePrice,
                  isOnSale,
                  id: variantId,
                } = variant;
                const unitPrice = isOnSale ? price : salePrice;

                return (
                  <div
                    key={"cartButton_item_" + variant + "_" + index}
                    className="relative mx-3 mb-1 flex flex-col items-center justify-center gap-1 bg-brand-black/90 px-3 py-3 text-brand-white"
                  >
                    {variantId && (
                      <CartAddSubtractButton
                        mode="subtract"
                        variantId={variantId?.toString()}
                        extendStyle="absolute left-8 cursor-pointer text-white/20"
                      />
                    )}

                    <div>{product?.name}</div>

                    <div className="flex flex-row gap-3">
                      <div>${unitPrice?.toFixed(2)}</div>
                      <div> x {quantity}</div>
                    </div>

                    {variantId && (
                      <CartAddSubtractButton
                        mode="add"
                        variantId={variantId?.toString()}
                        extendStyle="absolute right-8 cursor-pointer text-white/20"
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
