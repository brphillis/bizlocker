import type { OrderWithDetails } from "~/models/orders.server";
import BasicInput from "../../Input/BasicInput";

type Props = { order: OrderWithDetails };

const index = ({ order }: Props) => {
  return (
    <div className="collapse collapse-arrow rounded-sm !bg-base-200 px-3">
      <input type="checkbox" />
      <div className="collapse-title !ml-[12px] !mr-[-12px] w-full pt-4 text-center">
        Shipping Details
      </div>
      <div className="collapse-content">
        <div className="flex flex-col items-center gap-3">
          <BasicInput
            name="firstName"
            label="First Name"
            placeholder="First Name"
            type="text"
            extendContainerStyle="w-full"
            defaultValue={order?.firstName}
          />

          <BasicInput
            name="lastName"
            label="Last Name"
            placeholder="Last Name"
            type="text"
            extendContainerStyle="w-full"
            defaultValue={order?.lastName}
          />

          <BasicInput
            name="addressLine1"
            label="Address Line 1"
            placeholder="Address Line 1"
            type="text"
            extendContainerStyle="w-full"
            defaultValue={order?.address?.addressLine1}
          />

          <BasicInput
            name="addressLine2"
            label="Address Line 2"
            placeholder="Address Line 2"
            type="text"
            extendContainerStyle="w-full"
            defaultValue={order?.address?.addressLine2}
          />

          <BasicInput
            name="suburb"
            label="Suburb"
            placeholder="Suburb"
            type="text"
            extendContainerStyle="w-full"
            defaultValue={order?.address?.suburb}
          />

          <BasicInput
            name="state"
            label="State"
            placeholder="State"
            type="text"
            extendContainerStyle="w-full"
            defaultValue={order?.address?.state}
          />

          <BasicInput
            name="postcode"
            label="PostCode"
            placeholder="PostCode"
            type="text"
            extendContainerStyle="w-full"
            defaultValue={order?.address?.postcode}
          />

          <BasicInput
            name="country"
            label="Country"
            placeholder="Country"
            type="text"
            extendContainerStyle="w-full"
            defaultValue={order?.address?.country}
          />

          <div className="h-1"></div>
        </div>
      </div>
    </div>
  );
};

export default index;
