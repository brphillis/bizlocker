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
import { redirect, type ActionArgs, type LoaderArgs } from "@remix-run/node";
import {
  deleteProductSubCategory,
  getProductSubCategory,
  upsertProductSubCategory,
} from "~/models/productSubCategories.server";
import { useEffect, useState } from "react";
import BasicInput from "~/components/Forms/Input/BasicInput";
import { validateForm } from "~/utility/validate";
import { tokenAuth } from "~/auth.server";
import { STAFF_SESSION_KEY } from "~/session.server";
import BasicSelect from "~/components/Forms/Select/BasicSelect";
import { getProductCategories } from "~/models/productCategories.server";

export const loader = async ({ request, params }: LoaderArgs) => {
  const authenticated = await tokenAuth(request, STAFF_SESSION_KEY);
  if (!authenticated.valid) {
    return redirect("/admin/login");
  }

  const id = params?.id;
  const productSubCategory =
    id && id !== "add" && (await getProductSubCategory(id));

  const productCategories = await getProductCategories();

  return { productSubCategory, productCategories };
};

export const action = async ({ request, params }: ActionArgs) => {
  const authenticated = await tokenAuth(request, STAFF_SESSION_KEY);
  if (!authenticated.valid) {
    return redirect("/admin/login");
  }

  const id = params.id === "add" ? undefined : params.id;
  const form = Object.fromEntries(await request.formData());
  const { name, productCategory, index, displayInNavigation, isActive, image } =
    form;

  switch (form._action) {
    case "upsert":
      const validate = {
        name: true,
        index: true,
      };

      const validationErrors = validateForm(form, validate);
      if (validationErrors) {
        return { validationErrors };
      }

      const parsedImage = image
        ? (JSON.parse(image?.toString()) as Image)
        : undefined;

      const categoryData = {
        name: name,
        image: parsedImage,
        productCategory: productCategory,
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
  const { productSubCategory, productCategories } =
    (useLoaderData() as unknown as {
      productSubCategory: ProductSubCategory;
      productCategories: ProductCategory[];
    }) || {};
  const { validationErrors, success } = useActionData() as ActionReturnTypes;

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
        className="scrollbar-hide relative w-[500px] max-w-[100vw] overflow-y-auto bg-base-200 px-3 py-6 sm:px-6"
      >
        <FormHeader
          valueToChange={productSubCategory}
          type="Category"
          mode={mode}
          hasIsActive={true}
          hasDelete={true}
        />

        <div className="form-control  gap-3">
          <BasicInput
            label="Name"
            type="text"
            name="name"
            placeholder="Name"
            customWidth="w-full"
            defaultValue={productSubCategory?.name || ""}
            validationErrors={validationErrors}
          />

          <BasicInput
            label="Index"
            type="number"
            name="index"
            placeholder="Index"
            customWidth="w-full"
            defaultValue={productSubCategory?.index || 0}
            validationErrors={validationErrors}
          />

          <div className="form-control w-full">
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

          <BasicSelect
            name="productCategory"
            label="Category"
            selections={productCategories}
            placeholder="Parent Category"
            customWidth="w-full"
            defaultValue={productSubCategory.productCategoryId?.toString()}
          />

          <UploadImage
            defaultValue={productSubCategory?.image}
            label={"Image"}
          />
        </div>

        <BackSubmitButtons
          loading={loading}
          setLoading={setLoading}
          validationErrors={validationErrors}
        />
      </Form>
    </DarkOverlay>
  );
};

export default ModifyProductSubCategory;
