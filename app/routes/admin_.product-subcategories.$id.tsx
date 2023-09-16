import DarkOverlay from "~/components/Layout/DarkOverlay";
import FormHeader from "~/components/Forms/Headers/FormHeader";
import UploadImage from "~/components/Forms/Upload/UploadImage";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigate,
} from "@remix-run/react";
import BackSubmitButtons from "~/components/Forms/Buttons/BackSubmitButtons";
import { type ActionArgs, type LoaderArgs } from "@remix-run/node";
import {
  deleteProductSubCategory,
  getProductSubCategory,
  upsertProductSubCategory,
} from "~/models/productSubCategories.server";
import { useEffect, useState } from "react";

export const loader = async ({ params }: LoaderArgs) => {
  const id = params?.id;
  const productSubCategory =
    id && id !== "add" && (await getProductSubCategory(id));
  return productSubCategory;
};

export const action = async ({ request, params }: ActionArgs) => {
  const id = params.id === "add" ? undefined : params.id;
  const form = Object.fromEntries(await request.formData());
  const { name, index, displayInNavigation, isActive, image } = form;

  switch (form._action) {
    case "upsert":
      if (!name || name.length < 3) {
        const validationError = "name must be at least 3 chars.";
        return { validationError };
      }

      const parsedImage = image
        ? (JSON.parse(image?.toString()) as Image)
        : undefined;

      const categoryData = {
        name: name as string,
        image: parsedImage,
        index: parseInt(index as string),
        displayInNavigation: displayInNavigation ? true : false,
        isActive: isActive ? true : false,
        id: id,
      };

      await upsertProductSubCategory(categoryData);

      return { success: true };

    case "delete":
      await deleteProductSubCategory(id as string);
      return { success: true };
  }
};

const ModifyProductSubCategory = () => {
  const navigate = useNavigate();
  const productSubCategory = useLoaderData() || {};
  const { statusText, success } =
    (useActionData() as { statusText: string; success: boolean }) || {};
  const mode = productSubCategory ? "edit" : "add";

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
          valueToChange={productSubCategory}
          type="Category"
          mode={mode}
          hasIsActive={true}
          hasDelete={true}
        />

        <div className="form-control  gap-3">
          <div className="flex flex-wrap justify-evenly gap-3">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Name</span>
              </label>
              <input
                name="name"
                type="text"
                placeholder="Name"
                className="input input-bordered w-[95vw] sm:w-[215px]"
                defaultValue={productSubCategory?.name || ""}
              />
            </div>

            <div className="w-[95vw] sm:w-[215px]"></div>
          </div>

          <div className="mb-6 flex flex-wrap justify-evenly gap-3">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Index</span>
              </label>
              <input
                name="index"
                type="number"
                placeholder="Index"
                className="input input-bordered w-[95vw] sm:w-[215px]"
                defaultValue={productSubCategory?.index || ""}
              />
            </div>

            <div className="form-control w-full sm:w-[215px]">
              <label className="label text-sm">In Navigation</label>
              <select
                name="displayInNavigation"
                className="select w-full text-brand-black/75"
                defaultValue={
                  productSubCategory.displayInNavigation ? "true" : ""
                }
              >
                <option value="true">Yes</option>
                <option value="">No</option>
              </select>
            </div>
          </div>

          <UploadImage
            defaultValue={productSubCategory?.image}
            label={"Image"}
          />
        </div>

        {statusText && (
          <p className="pt-6 text-center text-sm text-red-500/75">
            {statusText}
          </p>
        )}

        <BackSubmitButtons loading={loading} setLoading={setLoading} />
      </Form>
    </DarkOverlay>
  );
};

export default ModifyProductSubCategory;
