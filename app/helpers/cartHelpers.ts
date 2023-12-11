import type { CartWithDetails } from "~/models/cart.server";
import type { Address } from "@prisma/client";
import type {
  AusPostDeliveryOption,
  GetPostageServicesType,
} from "~/integrations/auspost/types";
import { getShippingServices_Integration } from "~/integrations/_master/shipping";
import { getLatLongForPostcode } from "~/models/location.server";
import { prisma } from "~/db.server";
import { findClosestPostcode } from "./locationHelpers";

type CartDimensions = {
  height: number;
  width: number;
  length: number;
  weight: number;
  fragile: boolean;
};

export const getCartDeliveryOptions = async (
  cart: CartWithDetails,
  postCode: number
): Promise<AusPostDeliveryOption> => {
  const cartDimensions = getCartDimensions(cart);

  const shippingCoords = await getLatLongForPostcode(postCode.toString());

  const variantStoreIds: any = [];

  if (!cart.cartItems) {
    throw new Error("No Items In Cart");
  }

  for (const { variant } of cart.cartItems) {
    if (variant?.stock) {
      variantStoreIds.push(...variant.stock.map((e) => e.storeId));
    }
  }

  const stockedStores = await prisma.address.findMany({
    where: {
      storeId: {
        in: variantStoreIds,
      },
    },
  });

  let closestPostCode;

  if (shippingCoords) {
    closestPostCode = findClosestPostcode(
      shippingCoords?.lat,
      shippingCoords?.long,
      stockedStores as Address[]
    );
  }

  const postageServicesArgs = {
    height: cartDimensions.height,
    width: cartDimensions.width,
    length: cartDimensions.length,
    weight: cartDimensions.weight,
    from_postcode: closestPostCode || "4000",
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
        parseFloat(a.price) - parseFloat(b.price)
    );

  return filteredPostageServices;
};

export const getCartDimensions = (cart: CartWithDetails): CartDimensions => {
  let totalHeight: number = 0;
  let totalWidth: number = 0;
  let totalLength: number = 0;
  let totalWeight: number = 0;
  let fragile: boolean = false;

  if (!cart.cartItems) {
    throw new Error("No Items In Cart");
  }

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
    if (item?.variant?.isFragile) {
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
