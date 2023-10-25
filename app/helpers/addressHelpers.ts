export const SquareAddressToAddress = (
  squareAddress: SquareShippingDetails
): NewAddress => {
  const address: Address = {
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
    addressLine1: address?.addressLine1,
    addressLine2: address?.addressLine2,
    postalCode: address?.postcode,
    locality: address?.suburb,
    administrativeDistrictLevel1: address?.state,
    country: address?.country,
  };
  return squareAddress;
};
