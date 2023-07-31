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
  deleteProductCategory,
  getProductCategory,
  upsertProductCategory,
} from "~/models/productCategories.server";

export const loader = async ({ params }: LoaderArgs) => {
  const id = params?.id;
  const productCategory = id && id !== "add" && (await getProductCategory(id));
  return json(productCategory);
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

      await upsertProductCategory(name as string, parsedImage, id);

      return redirect("/admin/product-categories");

    case "delete":
      await deleteProductCategory(id as string);
      return redirect("/admin/product-categories");
  }
};

const ModifyProductCategory = () => {
  const productCategory = useLoaderData() as ProductCategory;
  const { validationError } =
    (useActionData() as { validationError: string }) || {};
  const mode = productCategory ? "edit" : "add";

  return (
    <DarkOverlay>
      <Form
        method="POST"
        className="relative max-w-full rounded-none bg-base-200 px-0 py-6 sm:rounded-md sm:px-6"
      >
        <FormHeader
          valueToChange={productCategory}
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
              className="input-bordered input w-full max-w-xs"
              defaultValue={productCategory?.name || undefined}
            />
          </div>

          <UploadImage defaultValue={productCategory?.image} />

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

export default ModifyProductCategory;
