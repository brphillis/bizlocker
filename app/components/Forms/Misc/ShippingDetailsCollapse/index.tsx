type Props = { shippingDetails: SquareShippingDetails };

const index = ({ shippingDetails }: Props) => {
  return (
    <div className="collapse-arrow collapse rounded-none !bg-brand-black px-3">
      <input type="checkbox" />
      <div className="collapse-title !ml-[12px] !mr-[-12px] w-full bg-brand-black pt-4 text-center text-brand-white">
        Shipping Details
      </div>
      <div className="collapse-content">
        <div className="flex flex-col items-center gap-3">
          <div className="mt-3 flex flex-row flex-wrap items-center justify-center gap-3">
            <div className="form-control">
              <label className="label">
                <span className="label-text text-brand-white">First Name</span>
              </label>
              <input
                readOnly
                name="firstName"
                type="text"
                placeholder="First Name"
                className="input input-bordered w-[95vw] sm:w-[215px]"
                defaultValue={shippingDetails?.firstName}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text text-brand-white">Last Name</span>
              </label>
              <input
                readOnly
                name="lastName"
                type="text"
                placeholder="Last Name"
                className="input input-bordered w-[95vw]  sm:w-[215px]"
                defaultValue={shippingDetails?.lastName}
              />
            </div>
          </div>

          <div className="flex flex-row flex-wrap justify-center gap-3">
            <div className="form-control">
              <label className="label">
                <span className="label-text text-brand-white">
                  Address Line 1
                </span>
              </label>
              <input
                readOnly
                name="addressLine1"
                type="text"
                placeholder="Address Line 1"
                className="input input-bordered w-[95vw]  sm:w-[215px]"
                defaultValue={shippingDetails?.addressLine1}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text text-brand-white">
                  Address Line 2
                </span>
              </label>
              <input
                readOnly
                name="addressLine2"
                type="text"
                placeholder="Address Line 2"
                className="input input-bordered w-[95vw] sm:w-[215px]"
                defaultValue={shippingDetails?.addressLine2}
              />
            </div>
          </div>

          <div className="flex flex-row flex-wrap justify-center gap-3">
            <div className="form-control">
              <label className="label">
                <span className="label-text text-brand-white">City/Suburb</span>
              </label>
              <input
                readOnly
                name="suburb"
                type="text"
                placeholder="State"
                className="input input-bordered w-[95vw] sm:w-[215px]"
                defaultValue={shippingDetails?.locality}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text text-brand-white">State</span>
              </label>
              <input
                readOnly
                name="state"
                type="text"
                placeholder="State"
                className="input input-bordered w-[95vw] sm:w-[215px]"
                defaultValue={shippingDetails?.administrativeDistrictLevel1}
              />
            </div>
          </div>

          <div className="flex flex-row flex-wrap justify-center gap-3">
            <div className="form-control">
              <label className="label">
                <span className="label-text text-brand-white">Post Code</span>
              </label>
              <input
                readOnly
                name="postcode"
                type="text"
                placeholder="Post Code"
                className="input input-bordered w-[95vw] sm:w-[215px]"
                defaultValue={shippingDetails?.postalCode}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text text-brand-white">Country</span>
              </label>
              <input
                readOnly
                name="country"
                type="text"
                placeholder="Country"
                className="input input-bordered w-[95vw] sm:w-[215px]"
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
