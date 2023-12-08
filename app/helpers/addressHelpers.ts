import type { Address } from "@prisma/client";

export const SquareAddressToAddress = (
  squareAddress: SquareShippingDetails
): NewAddress => {
  const address: NewAddress = {
    addressLine1: squareAddress?.addressLine1,
    addressLine2: squareAddress?.addressLine2,
    postcode: squareAddress?.postalCode,
    suburb: squareAddress?.locality,
    state: squareAddress?.administrativeDistrictLevel1,
    country: squareAddress?.country,
  };
  return address;
};

export const AddressToSquareAddress = (
  address: Address | NewAddress
): SquareShippingDetails => {
  const squareAddress: SquareShippingDetails = {
    addressLine1: address?.addressLine1 || undefined,
    addressLine2: address?.addressLine2 || undefined,
    postalCode: address?.postcode || undefined,
    locality: address?.suburb || undefined,
    administrativeDistrictLevel1: address?.state || undefined,
    country: address?.country || undefined,
  };
  return squareAddress;
};
