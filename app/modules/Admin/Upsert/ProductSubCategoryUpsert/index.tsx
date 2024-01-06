import { type FormEvent, useEffect, useState } from "react";
import { json } from "@remix-run/node";
import type { Image } from "@prisma/client";
import { getFormData } from "~/helpers/formHelpers";
import DarkOverlay from "~/components/Layout/Overlays/DarkOverlay";
import BasicInput from "~/components/Forms/Input/BasicInput";
import type { ActionReturnTypes } from "~/utility/actionTypes";
import UploadImage from "~/components/Forms/Upload/UploadImage";
import BasicSelect from "~/components/Forms/Select/BasicSelect";
import { type ValidationErrors, validateForm } from "~/utility/validate";
import { getProductCategories } from "~/models/productCategories.server";
import BackSubmitButtons from "~/components/Forms/Buttons/BackSubmitButtons";
import useNotification, {
  type PageNotification,
} from "~/hooks/PageNotification";
import {
  Form,
  type Params,
  useActionData,
  useLoaderData,
  useNavigate,
  useSubmit,
  useSearchParams,
} from "@remix-run/react";
import {
  deleteProductSubCategory,
  getProductSubCategory,
  type NewProductSubCategory,
  type ProductSubCategoryWithDetails,
  upsertProductSubCategory,
} from "~/models/productSubCategories.server";
import WindowContainer from "~/components/Layout/Containers/WindowContainer";

const validateOptions = {
  name: true,
  index: true,
};

export const productSubCategoryUpsertLoader = async (
  request: Request,
  params: Params<string>
) => {
  const productCategories = await getProductCategories();

  let { searchParams } = new URL(request.url);
  let id = searchParams.get("contentId");

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

export const productSubCategoryUpsertAction = async (
  request: Request,
  params: Params<string>
) => {
  let notification: PageNotification;

  let { searchParams } = new URL(request.url);
  const contentId = searchParams.get("contentId");
  let id = contentId === "add" || !contentId ? undefined : contentId;

  const { formEntries, formErrors } = validateForm(
    await request.formData(),
    validateOptions
  );

  const { name, productCategory, index, displayInNavigation, isActive, image } =
    formEntries;

  switch (formEntries._action) {
    case "upsert":
      if (formErrors) {
        return { serverValidationErrors: formErrors };
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

      notification = {
        type: "success",
        message: `Category ${id === "add" ? "Added" : "Updated"}.`,
      };

      return json({ success: true, notification });

    case "delete":
      await deleteProductSubCategory(id as string);

      notification = {
        type: "warning",
        message: "Category Deleted",
      };

      return json({ success: true, notification });
  }
};

type Props = {
  offRouteModule?: boolean;
};

const ProductSubCategoryUpsert = ({ offRouteModule }: Props) => {
  const { productSubCategory, productCategories } =
    useLoaderData<typeof productSubCategoryUpsertLoader>();
  const { serverValidationErrors, success, notification } =
    (useActionData() as ActionReturnTypes) || {};

  const navigate = useNavigate();
  let submit = useSubmit();
  const [searchParams] = useSearchParams();
  const contentId = searchParams.get("contentId");
  useNotification(notification);

  const [clientValidationErrors, setClientValidationErrors] =
    useState<ValidationErrors>();
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    const form = getFormData(event);
    event.preventDefault();

    const { formErrors } = validateForm(new FormData(form), validateOptions);
    if (formErrors) {
      setClientValidationErrors(formErrors);
      setLoading(false);
      return;
    }

    const submitFunction = () => {
      submit(form, {
        method: "POST",
        action: `/admin/upsert/productSubCategory?contentId=${contentId}`,
        navigate: offRouteModule ? false : true,
      });
    };

    submitFunction();

    if (offRouteModule) {
      navigate(-1);
    }
  };

  useEffect(() => {
    if (success) {
      navigate(-1);
    }
  }, [success, navigate]);

  return (
    <DarkOverlay>
      <WindowContainer
        hasDelete={true}
        hasIsActive={true}
        isActive={productSubCategory?.isActive}
        title="Category"
        children={
          <Form
            method="POST"
            onSubmit={handleSubmit}
            className="scrollbar-hide relative w-[500px] max-w-full overflow-y-auto"
          >
            <div className="form-control  gap-3">
              <BasicInput
                label="Name"
                type="text"
                name="name"
                placeholder="Name"
                customWidth="w-full"
                defaultValue={productSubCategory?.name || ""}
                validationErrors={
                  serverValidationErrors || clientValidationErrors
                }
              />

              <BasicInput
                label="Index"
                type="number"
                name="index"
                placeholder="Index"
                customWidth="w-full"
                defaultValue={productSubCategory?.index || 0}
                validationErrors={
                  serverValidationErrors || clientValidationErrors
                }
              />

              <BasicSelect
                name="displayInNavigation"
                label="Display In Navigation"
                selections={[
                  { id: "yes", name: "Yes" },
                  { id: "no", name: "No" },
                ]}
                placeholder="Display In Navigation"
                customWidth="w-full"
                defaultValue={
                  productSubCategory?.displayInNavigation ? "yes" : "no"
                }
              />

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
              validationErrors={
                serverValidationErrors || clientValidationErrors
              }
            />
          </Form>
        }
      />
    </DarkOverlay>
  );
};

export default ProductSubCategoryUpsert;
