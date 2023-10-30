import BasicInput from "../../Input/BasicInput";

type Props = { shippingDetails: SquareShippingDetails };

const index = ({ shippingDetails }: Props) => {
  return (
    <div className="collapse collapse-arrow rounded-sm !bg-brand-black px-3">
      <input type="checkbox" />
      <div className="collapse-title !ml-[12px] !mr-[-12px] w-full pt-4 text-center text-brand-white">
        Shipping Details
      </div>
      <div className="collapse-content">
        <div className="flex flex-col items-center gap-3">
          <BasicInput
            name="firstName"
            labelColor="text-white"
            label="First Name"
            placeholder="First Name"
            type="text"
            customWidth="w-full"
            defaultValue={shippingDetails?.firstName}
          />

          <BasicInput
            name="lastName"
            labelColor="text-white"
            label="Last Name"
            placeholder="Last Name"
            type="text"
            customWidth="w-full"
            defaultValue={shippingDetails?.lastName}
          />

          <BasicInput
            name="addressLine1"
            labelColor="text-white"
            label="Address Line 1"
            placeholder="Address Line 1"
            type="text"
            customWidth="w-full"
            defaultValue={shippingDetails?.addressLine1}
          />

          <BasicInput
            name="addressLine2"
            labelColor="text-white"
            label="Address Line 2"
            placeholder="Address Line 2"
            type="text"
            customWidth="w-full"
            defaultValue={shippingDetails?.addressLine2}
          />

          <BasicInput
            name="suburb"
            labelColor="text-white"
            label="Suburb"
            placeholder="Suburb"
            type="text"
            customWidth="w-full"
            defaultValue={shippingDetails?.locality}
          />

          <BasicInput
            name="state"
            labelColor="text-white"
            label="State"
            placeholder="State"
            type="text"
            customWidth="w-full"
            defaultValue={shippingDetails?.administrativeDistrictLevel1}
          />

          <BasicInput
            name="postcode"
            labelColor="text-white"
            label="PostCode"
            placeholder="PostCode"
            type="text"
            customWidth="w-full"
            defaultValue={shippingDetails?.postalCode}
          />

          <BasicInput
            name="country"
            labelColor="text-white"
            label="Country"
            placeholder="Country"
            type="text"
            customWidth="w-full"
            defaultValue={shippingDetails?.country}
          />

          <div className="h-1"></div>
        </div>
      </div>
    </div>
  );
};

export default index;
