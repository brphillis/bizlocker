import { type ActionArgs, type LoaderArgs } from "@remix-run/node";
import { Form, useLoaderData, useNavigate } from "@remix-run/react";
import { useState } from "react";
import { getUser, upsertUser } from "~/models/users.server";
import { ISO3166Countries } from "~/utility/countryList";
import { ConvertToBase64 } from "~/utility/fileHelpers";
import { placeholderAvatar } from "~/utility/placeholderAvatar";
import { capitalizeFirst } from "~/utility/stringHelpers";

export const loader = async ({ params }: LoaderArgs) => {
  const id = params?.id;

  if (id && id !== "add") {
    const user = await getUser(id);
    return user;
  } else return null;
};

export const action = async ({ request, params }: ActionArgs) => {
  const id = params.id === "add" ? undefined : params.id;
  const {
    email,
    firstName,
    lastName,
    dateofbirth,
    phonenumber,
    address1,
    address2,
    postcode,
    suburb,
    state,
    country,
    image,
    isActive,
  } = Object.fromEntries(await request.formData());

  const updateData = {
    email: email as string,
    firstName: firstName as string,
    lastName: lastName as string,
    dateOfBirth: new Date(dateofbirth as string),
    phoneNumber: phonenumber as string,
    addressLine1: address1 as string,
    addressLine2: address2 as string,
    postcode: postcode as string,
    suburb: suburb as string,
    state: state as string,
    country: country as string,
    isActive: isActive ? true : false,
    avatar: image ? (JSON.parse(image?.toString()) as Image) : undefined,
    id: id,
  };

  return await upsertUser(updateData);
};

const ModifyUser = () => {
  const navigate = useNavigate();
  const user = useLoaderData() as User;
  const [image, setImage] = useState<Image | undefined>(
    user?.avatar || undefined
  );
  const mode = user ? "edit" : "add";

  const [isActive, setisActive] = useState<string | undefined>(
    mode === "add" ? " " : user?.isActive ? " " : ""
  );

  return (
    <div
      className="
        absolute inset-0 flex h-max min-h-[100vh] max-w-[100vw] flex-col items-center justify-center bg-black/80 py-3"
    >
      <Form
        method="POST"
        className="
            relative w-[600px] max-w-[99vw] rounded-lg border-t-4 border-primary bg-base-300 p-6"
      >
        <div className="mb-6 flex w-[100%] flex-row justify-between">
          <h1>{mode && capitalizeFirst(mode)} User</h1>

          <label className="label absolute right-16 top-[1.1rem] cursor-pointer">
            <input
              type="checkbox"
              className="toggle-success toggle ml-3"
              checked={isActive ? true : false}
              onChange={(e) =>
                setisActive(e.target.checked ? "true" : undefined)
              }
            />
            <span className="label-text ml-3">Active</span>
            <input name="isActive" value={isActive || ""} readOnly hidden />
          </label>
        </div>

        <div className="divider w-full pb-4" />

        <div className="form-control">
          <div className="flex flex-row flex-wrap justify-around gap-3">
            <div className="flex items-center justify-center gap-6">
              <div className="avatar">
                <div className="w-32 rounded-full ring ring-primary ring-offset-2 ring-offset-base-100">
                  <img
                    src={image?.url || placeholderAvatar?.url || undefined}
                    alt="user_avatar"
                  />
                </div>
              </div>
              <div>
                <input
                  type="file"
                  accept="image/*"
                  className="file-input-bordered file-input w-full"
                  onChange={async (e) => {
                    const convertedImage = await ConvertToBase64(e);
                    convertedImage && setImage(convertedImage);
                  }}
                />
              </div>
              <input
                type="hidden"
                name="image"
                value={JSON.stringify(image) || ""}
              />
            </div>

            <div className="divider w-full pt-4" />

            <div className="form-control">
              <label className="label">
                <span className="label-text">Email Address</span>
              </label>
              <input
                name="email"
                type="text"
                placeholder="Email Address"
                className="input-bordered input w-[95vw] sm:w-full"
                defaultValue={user?.email || undefined}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">First Name</span>
              </label>
              <input
                name="firstName"
                type="text"
                placeholder="First Name"
                className="input-bordered input w-[95vw] sm:w-full"
                defaultValue={user?.userDetails?.firstName || undefined}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Last Name</span>
              </label>
              <input
                name="lastName"
                type="text"
                placeholder="Last Name"
                className="input-bordered input w-[95vw] sm:w-full"
                defaultValue={user?.userDetails?.lastName || undefined}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Phone Number</span>
              </label>
              <input
                name="phonenumber"
                type="text"
                placeholder="Phone Number"
                className="input-bordered input w-[95vw] sm:w-full"
                defaultValue={user?.userDetails?.phoneNumber || undefined}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Date of Birth</span>
              </label>
              <input
                name="dateofbirth"
                type="date"
                placeholder="Date of Birth"
                className="input-bordered input w-[95vw] min-w-[235px] cursor-pointer sm:w-full"
                defaultValue={
                  user?.userDetails?.dateOfBirth
                    ? new Date(user?.userDetails?.dateOfBirth)
                        .toISOString()
                        .split("T")[0]
                    : undefined
                }
              />
            </div>

            <div className="min-w-[230px]" />

            <div className="divider w-full pt-4" />

            <div className="form-control">
              <label className="label">
                <span className="label-text">Address Line 1</span>
              </label>
              <input
                name="address1"
                type="text"
                placeholder="Address Line 1"
                className="input-bordered input w-[95vw] sm:w-full"
                defaultValue={user?.address?.addressLine1 || undefined}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Address Line 2</span>
              </label>
              <input
                name="address2"
                type="text"
                placeholder="Address Line 2"
                className="input-bordered input w-[95vw] sm:w-full"
                defaultValue={user?.address?.addressLine2 || undefined}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Suburb</span>
              </label>
              <input
                name="suburb"
                type="text"
                placeholder="Suburb"
                className="input-bordered input w-[95vw] sm:w-full"
                defaultValue={user?.address?.suburb || undefined}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Post Code</span>
              </label>
              <input
                name="postcode"
                type="text"
                placeholder="Post Code"
                className="input-bordered input w-[95vw] sm:w-full"
                defaultValue={user?.address?.postcode || undefined}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">State</span>
              </label>
              <input
                name="state"
                type="text"
                placeholder="State"
                className="input-bordered input w-[95vw] sm:w-full"
                defaultValue={user?.address?.state || undefined}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Country</span>
              </label>
              <select
                name="country"
                className="select-bordered select w-[95vw] sm:w-[230px]"
                defaultValue={user?.address?.country}
                placeholder="Select a Value"
              >
                <option value="">Select a Country</option>
                {ISO3166Countries?.map(({ code, name }: CountrySelect) => {
                  return (
                    <option key={code + name} value={code}>
                      {name}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="divider w-full pt-4" />
          </div>

          <div className="flex flex-row justify-center gap-6">
            <button
              type="button"
              className="btn-primary btn mt-6 w-max"
              onClick={() => navigate("..")}
            >
              Back
            </button>

            <button type="submit" className="btn-primary btn mt-6 w-max">
              Submit
            </button>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default ModifyUser;
