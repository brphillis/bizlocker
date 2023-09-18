import { tokenAuth } from "~/auth.server";
import DarkOverlay from "~/components/Layout/DarkOverlay";
import FormHeader from "~/components/Forms/Headers/FormHeader";
import UploadImage from "~/components/Forms/Upload/UploadImage";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigate,
} from "@remix-run/react";
import { deleteBrand, getBrand, upsertBrand } from "~/models/brands.server";
import BackSubmitButtons from "~/components/Forms/Buttons/BackSubmitButtons";
import { redirect, type ActionArgs, type LoaderArgs } from "@remix-run/node";
import { useEffect, useState } from "react";

export const loader = async ({ params }: LoaderArgs) => {
  const id = params?.id;

  if (id && id !== "add") {
    return await getBrand(id);
  } else {
    return null;
  }
};

export const action = async ({ request, params }: ActionArgs) => {
  const authenticated = await tokenAuth(request);
  if (!authenticated.valid) {
    return redirect("/login");
  }
  const id = params.id === "add" ? undefined : params.id;
  const form = Object.fromEntries(await request.formData());
  const { name, image } = form;

  let validationError: string[] = [];

  if (!name) {
    validationError.push("Name is Required");
  }

  if (validationError.length > 0) {
    return { validationError };
  }

  switch (form._action) {
    case "upsert":
      if (!name || name.length < 3) {
        const validationError = "name must be at least 3 chars.";
        return { validationError };
      }

      const parsedImage = image
        ? (JSON.parse(image?.toString()) as Image)
        : undefined;

      await upsertBrand(name as string, parsedImage, id);

      return { success: true };

    case "delete":
      await deleteBrand(id as string);
      return { success: true };
  }
};

const ModifyBrand = () => {
  const navigate = useNavigate();
  const brand = useLoaderData();
  const { validationError, success } =
    (useActionData() as { success: boolean; validationError: string[] }) || {};
  const mode = brand ? "edit" : "add";

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (success) {
      navigate(-1);
    }
  }, [success, navigate]);

  return (
    <DarkOverlay>
      <Form
        method="POST"
        className="relative max-w-full rounded-none bg-base-200 px-0 py-6 sm:rounded-md sm:px-6"
      >
        <FormHeader
          valueToChange={brand}
          type="Brand"
          mode={mode}
          hasIsActive={true}
          hasDelete={true}
        />

        <div className="form-control w-full max-w-xs gap-3">
          <div className="form-control w-full max-w-xs ">
            <label className="label">
              <span className="label-text">Name</span>
            </label>
            <input
              name="name"
              type="text"
              placeholder="Name"
              className="input input-bordered w-full max-w-xs"
              defaultValue={brand?.name || undefined}
            />
          </div>

          <UploadImage defaultValue={brand?.image} />
        </div>

        <BackSubmitButtons
          loading={loading}
          setLoading={setLoading}
          validationErrors={validationError}
        />
      </Form>
    </DarkOverlay>
  );
};

export default ModifyBrand;
