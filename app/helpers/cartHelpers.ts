import { getShippingServices_Integration } from "~/integrations/_master/shipping";

export const getCartDeliveryOptions = async (
  cart: Cart,
  postCode: number
): Promise<AusPostDeliveryOption> => {
  const cartDimensions = getCartDimensions(cart);

  const postageServicesArgs = {
    height: cartDimensions.height,
    width: cartDimensions.width,
    length: cartDimensions.length,
    weight: cartDimensions.weight,
    from_postcode: "4000",
    to_postcode: postCode.toString(),
  };

  const postageServices = await getShippingServices_Integration(
    postageServicesArgs as GetPostageServicesType
  );

  const filteredPostageServices = postageServices
    .filter(
      (e: AusPostDeliveryOption) =>
        e.code === "AUS_PARCEL_EXPRESS" || e.code === "AUS_PARCEL_REGULAR"
    )
    .sort(
      (a: AusPostDeliveryOption, b: AusPostDeliveryOption) =>
        parseInt(a.price) - parseInt(b.price)
    );

  return filteredPostageServices;
};

export const getCartDimensions = (cart: Cart): CartDimensions => {
  let totalHeight: number = 0;
  let totalWidth: number = 0;
  let totalLength: number = 0;
  let totalWeight: number = 0;
  let fragile: boolean = false;

  for (const item of cart.cartItems) {
    if (item.variant && typeof item.variant.height === "number") {
      totalHeight += item.variant.height;
    }
    if (item.variant && typeof item.variant.width === "number") {
      totalWidth += item.variant.width;
    }
    if (item.variant && typeof item.variant.length === "number") {
      totalLength += item.variant.length;
    }
    if (item.variant && typeof item.variant.weight === "number") {
      totalWeight += item.variant.weight;
    }
    if (item.variant.isFragile) {
      fragile = true;
    }
  }

  return {
    height: totalHeight,
    width: totalWidth,
    length: totalLength,
    weight: totalWeight,
    fragile,
  };
};
