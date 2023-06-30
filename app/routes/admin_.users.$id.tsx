import { redirect, type ActionArgs, type LoaderArgs } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import BackSubmitButtons from "~/components/Forms/Buttons/BackSubmitButtons";
import FormHeader from "~/components/Forms/Headers/FormHeader";
import SelectCountry from "~/components/Forms/Select/SelectCountry";
import UploadAvatar from "~/components/Forms/Upload/UploadAvatar";
import DarkOverlay from "~/components/Layout/DarkOverlay";
import { getUser, upsertUser } from "~/models/users.server";

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
    avatar,
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
    avatar: avatar ? (JSON.parse(avatar?.toString()) as Image) : undefined,
    id: id,
  };

  await upsertUser(updateData);

  return redirect("/admin/users");
};

const ModifyUser = () => {
  const user = useLoaderData() as User;

  const mode = user ? "edit" : "add";

  return (
    <DarkOverlay>
      <Form
        method="POST"
        className="max-w-screen relative w-[720px] bg-base-300 py-6 sm:px-6"
      >
        <FormHeader
          hasDelete={false}
          hasIsActive={true}
          mode={mode}
          type="User"
          valueToChange={user}
        />

        <div className="form-control gap-3">
          <div className="flex flex-wrap justify-evenly gap-3">
            <UploadAvatar avatar={user?.avatar} />

            <div className="flex flex-row flex-wrap justify-center gap-6">
              <div className="form-control gap-3">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Email Address</span>
                  </label>
                  <input
                    name="email"
                    type="text"
                    placeholder="Email Address"
                    className="input-bordered input w-[95vw] sm:w-[215px]"
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
                    className="input-bordered input w-[95vw] sm:w-[215px]"
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
                    className="input-bordered input w-[95vw] sm:w-[215px]"
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
                    className="input-bordered input w-[95vw] sm:w-[215px]"
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
              </div>

              <div className="form-control gap-3">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Address Line 1</span>
                  </label>
                  <input
                    name="address1"
                    type="text"
                    placeholder="Address Line 1"
                    className="input-bordered input w-[95vw] sm:w-[215px]"
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
                    className="input-bordered input w-[95vw] sm:w-[215px]"
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
                    className="input-bordered input w-[95vw] sm:w-[215px]"
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
                    className="input-bordered input w-[95vw] sm:w-[215px]"
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
                    className="input-bordered input w-[95vw] sm:w-[215px]"
                    defaultValue={user?.address?.state || undefined}
                  />
                </div>

                <SelectCountry defaultValue={user?.address?.country} />
              </div>
            </div>
          </div>
        </div>
        <BackSubmitButtons />
      </Form>
    </DarkOverlay>
  );
};

export default ModifyUser;
