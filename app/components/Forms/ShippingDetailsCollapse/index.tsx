type Props = { shippingDetails: SquareShippingDetails };

const index = ({ shippingDetails }: Props) => {
  return (
    <div className="collapse-arrow collapse bg-base-300">
      <input type="checkbox" />
      <div className="collapse-title w-full bg-base-300 py-3 text-center">
        Shipping Details
      </div>
      <div className="collapse-content">
        <div className="flex flex-col items-center gap-3">
          <div className="mt-3 flex flex-row flex-wrap items-center justify-center gap-3">
            <div className="form-control">
              <label className="label">
                <span className="label-text">First Name</span>
              </label>
              <input
                readOnly
                name="firstName"
                type="text"
                placeholder="First Name"
                className="input-bordered input w-[95vw] sm:w-[215px]"
                defaultValue={shippingDetails?.firstName}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Last Name</span>
              </label>
              <input
                readOnly
                name="lastName"
                type="text"
                placeholder="Last Name"
                className="input-bordered input w-[95vw]  sm:w-[215px]"
                defaultValue={shippingDetails?.lastName}
              />
            </div>
          </div>

          <div className="flex flex-row flex-wrap justify-center gap-3">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Address Line 1</span>
              </label>
              <input
                readOnly
                name="addressLine1"
                type="text"
                placeholder="Address Line 1"
                className="input-bordered input w-[95vw]  sm:w-[215px]"
                defaultValue={shippingDetails?.addressLine1}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Address Line 2</span>
              </label>
              <input
                readOnly
                name="addressLine2"
                type="text"
                placeholder="Address Line 2"
                className="input-bordered input w-[95vw] sm:w-[215px]"
                defaultValue={shippingDetails?.addressLine2}
              />
            </div>
          </div>

          <div className="flex flex-row flex-wrap justify-center gap-3">
            <div className="form-control">
              <label className="label">
                <span className="label-text">City/Suburb</span>
              </label>
              <input
                readOnly
                name="suburb"
                type="text"
                placeholder="State"
                className="input-bordered input w-[95vw] sm:w-[215px]"
                defaultValue={shippingDetails?.locality}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">State</span>
              </label>
              <input
                readOnly
                name="state"
                type="text"
                placeholder="State"
                className="input-bordered input w-[95vw] sm:w-[215px]"
                defaultValue={shippingDetails?.administrativeDistrictLevel1}
              />
            </div>
          </div>

          <div className="flex flex-row flex-wrap justify-center gap-3">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Post Code</span>
              </label>
              <input
                readOnly
                name="postcode"
                type="text"
                placeholder="Post Code"
                className="input-bordered input w-[95vw] sm:w-[215px]"
                defaultValue={shippingDetails?.postalCode}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Country</span>
              </label>
              <input
                readOnly
                name="country"
                type="text"
                placeholder="Country"
                className="input-bordered input w-[95vw] sm:w-[215px]"
                defaultValue={shippingDetails?.country}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default index;
