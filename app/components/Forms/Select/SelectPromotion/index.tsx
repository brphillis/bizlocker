import { useState } from "react";

type Props = {
  promotions: Promotion[];
  valueToChange: Product;
};

const SelectPromotion = ({ promotions, valueToChange }: Props) => {
  const [promotionDiscount, setPromotionDiscount] = useState<
    string | undefined
  >(valueToChange?.promotion?.discountPercentage.toString());

  return (
    <div className="form-control">
      <label className="label text-sm">
        Promotion
        {promotionDiscount !== undefined && (
          <span className="text-[10px] text-error">
            -{promotionDiscount}% Applied to Promo Items
          </span>
        )}
      </label>
      <select
        name="promotion"
        className=" select w-[95vw] sm:w-[215px]"
        defaultValue={valueToChange?.promotion?.id || ""}
        onChange={(e) => {
          const selectedPromotionId = e.target.value;
          const selectedPromotion = promotions.find(
            (promotion) => promotion.id === Number(selectedPromotionId)
          );
          if (selectedPromotion) {
            setPromotionDiscount(String(selectedPromotion.discountPercentage));
          } else {
            setPromotionDiscount(undefined);
          }
        }}
      >
        {!promotions && (
          <option disabled value="">
            No Promotions
          </option>
        )}

        {promotions && <option value="">No Promotion Applied</option>}

        {promotions?.map(
          ({ id, name, discountPercentage, isActive }: Promotion) =>
            isActive ? (
              <option key={"promotion_" + id} value={id}>
                {name} - {discountPercentage}% Discount
              </option>
            ) : null
        )}
      </select>
    </div>
  );
};

export default SelectPromotion;
