import { tokenAuth } from "~/auth.server";
import DarkOverlay from "~/components/Layout/DarkOverlay";
import FormHeader from "~/components/Forms/Headers/FormHeader";
import UploadImage from "~/components/Forms/Upload/UploadImage";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { deleteBrand, getBrand, upsertBrand } from "~/models/brands.server";
import BackSubmitButtons from "~/components/Forms/Buttons/BackSubmitButtons";
import {
  json,
  redirect,
  type ActionArgs,
  type LoaderArgs,
} from "@remix-run/node";

export const loader = async ({ params }: LoaderArgs) => {
  const id = params?.id;

  if (id && id !== "add") {
    const brand = await getBrand(id);
    return json({ brand });
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

  switch (form._action) {
    case "upsert":
      if (!name || name.length < 3) {
        const validationError = "name must be at least 3 chars.";
        return { validationError };
      }

      const parsedImage = image
        ? (JSON.parse(image?.toString()) as Image)
        : undefined;

      upsertBrand(name as string, parsedImage, id);

      return redirect("/admin/brands");

    case "delete":
      await deleteBrand(id as string);
      return redirect("/admin/brands");
  }
};

const ModifyBrand = () => {
  const { brand } =
    (useLoaderData() as {
      brand: Brand;
    }) || {};
  const { validationError } =
    (useActionData() as { validationError: string }) || {};
  const mode = brand ? "edit" : "add";

  return (
    <DarkOverlay>
      <Form
        method="POST"
        className="max-w-screen scrollbar-hide relative w-[360px] !max-w-[100vw] overflow-y-auto bg-base-300 px-3 py-6 sm:px-6"
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
              className="input-bordered input w-full max-w-xs"
              defaultValue={brand?.name || undefined}
            />
          </div>

          <UploadImage defaultValue={brand?.image} />

          {validationError && (
            <p className="h-0 py-3 text-center text-sm text-red-500/75">
              {validationError}
            </p>
          )}
        </div>

        <BackSubmitButtons />
      </Form>
    </DarkOverlay>
  );
};

export default ModifyBrand;
