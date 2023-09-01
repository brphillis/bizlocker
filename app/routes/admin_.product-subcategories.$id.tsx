import DarkOverlay from "~/components/Layout/DarkOverlay";
import FormHeader from "~/components/Forms/Headers/FormHeader";
import UploadImage from "~/components/Forms/Upload/UploadImage";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import BackSubmitButtons from "~/components/Forms/Buttons/BackSubmitButtons";
import {
  json,
  redirect,
  type ActionArgs,
  type LoaderArgs,
} from "@remix-run/node";
import {
  deleteProductSubCategory,
  getProductSubCategory,
  upsertProductSubCategory,
} from "~/models/productSubCategories.server";
import { useState } from "react";

export const loader = async ({ params }: LoaderArgs) => {
  const id = params?.id;
  const productSubCategory =
    id && id !== "add" && (await getProductSubCategory(id));
  return json(productSubCategory);
};

export const action = async ({ request, params }: ActionArgs) => {
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

      await upsertProductSubCategory(name as string, parsedImage, id);

      return redirect("/admin/product-subcategories");

    case "delete":
      await deleteProductSubCategory(id as string);
      return redirect("/admin/product-subcategories");
  }
};

const ModifyProductSubCategory = () => {
  const productSubCategory = useLoaderData() || {};
  const { validationError } =
    (useActionData() as { validationError: string }) || {};
  const mode = productSubCategory ? "edit" : "add";

  const [loading, setLoading] = useState<boolean>(false);

  return (
    <DarkOverlay>
      <Form
        method="POST"
        className="relative max-w-full rounded-none bg-base-200 px-0 py-6 sm:rounded-md sm:px-6"
      >
        <FormHeader
          valueToChange={productSubCategory}
          type="Category"
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
              defaultValue={productSubCategory?.name || undefined}
            />
          </div>

          <UploadImage defaultValue={productSubCategory?.image} />

          {validationError && (
            <p className="h-0 py-3 text-center text-sm text-red-500/75">
              {validationError}
            </p>
          )}
        </div>

        <BackSubmitButtons loading={loading} setLoading={setLoading} />
      </Form>
    </DarkOverlay>
  );
};

export default ModifyProductSubCategory;
