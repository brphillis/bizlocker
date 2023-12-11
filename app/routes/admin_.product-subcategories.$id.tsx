import DarkOverlay from "~/components/Layout/DarkOverlay";
import type { ActionReturnTypes } from "~/utility/actionTypes";
import FormHeader from "~/components/Forms/Headers/FormHeader";
import UploadImage from "~/components/Forms/Upload/UploadImage";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigate,
} from "@remix-run/react";
import BackSubmitButtons from "~/components/Forms/Buttons/BackSubmitButtons";
import {
  redirect,
  type ActionArgs,
  type LoaderArgs,
  json,
} from "@remix-run/node";
import {
  type ProductSubCategoryWithDetails,
  deleteProductSubCategory,
  getProductSubCategory,
  upsertProductSubCategory,
  type NewProductSubCategory,
} from "~/models/productSubCategories.server";
import { useEffect, useState } from "react";
import BasicInput from "~/components/Forms/Input/BasicInput";
import { validateForm } from "~/utility/validate";
import { tokenAuth } from "~/auth.server";
import { STAFF_SESSION_KEY } from "~/session.server";
import BasicSelect from "~/components/Forms/Select/BasicSelect";
import { getProductCategories } from "~/models/productCategories.server";
import type { Image } from "@prisma/client";

export const loader = async ({ request, params }: LoaderArgs) => {
  const authenticated = await tokenAuth(request, STAFF_SESSION_KEY);

  if (!authenticated.valid) {
    return redirect("/admin/login");
  }

  const productCategories = await getProductCategories();

  const id = params?.id;

  if (!id) {
    throw new Response(null, {
      status: 404,
      statusText: "Product Sub Category Not Found",
    });
  }

  const productSubCategory =
    id === "add"
      ? ({} as ProductSubCategoryWithDetails)
      : await getProductSubCategory(id);

  if (!productSubCategory) {
    throw new Response(null, {
      status: 404,
      statusText: "Product Sub Category Not Found",
    });
  }

  return json({ productSubCategory, productCategories });
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
        return json({ validationErrors });
      }

      const parsedImage = image
        ? (JSON.parse(image?.toString()) as Image)
        : undefined;

      const categoryData: NewProductSubCategory = {
        name: name as string,
        image: parsedImage,
        productCategory: productCategory as string,
        index: parseInt(index as string),
        displayInNavigation: displayInNavigation ? true : false,
        isActive: isActive ? true : false,
        id: id,
      };

      await upsertProductSubCategory(categoryData);

      return json({ success: true });

    case "delete":
      await deleteProductSubCategory(id as string);
      return json({ success: true });
  }
};

const ModifyProductSubCategory = () => {
  const navigate = useNavigate();
  const { productSubCategory, productCategories } =
    useLoaderData<typeof loader>();
  const { validationErrors, success } =
    (useActionData() as ActionReturnTypes) || {};

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
