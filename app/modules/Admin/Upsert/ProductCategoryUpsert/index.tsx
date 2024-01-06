import { type FormEvent, useEffect, useState } from "react";
import { json } from "@remix-run/node";
import { getFormData } from "~/helpers/formHelpers";
import DarkOverlay from "~/components/Layout/Overlays/DarkOverlay";
import BasicInput from "~/components/Forms/Input/BasicInput";
import type { ActionReturnTypes } from "~/utility/actionTypes";
import BasicSelect from "~/components/Forms/Select/BasicSelect";
import { type ValidationErrors, validateForm } from "~/utility/validate";
import BasicMultiSelect from "~/components/Forms/Select/BasicMultiSelect";
import BackSubmitButtons from "~/components/Forms/Buttons/BackSubmitButtons";
import useNotification, {
  type PageNotification,
} from "~/hooks/PageNotification";
import {
  getDepartments,
  type DepartmentWithDetails,
} from "~/models/departments.server";
import {
  getArticleCategories,
  type ArticleCategoryWithDetails,
} from "~/models/articleCategories.server";
import {
  getProductSubCategories,
  type ProductSubCategoryWithDetails,
} from "~/models/productSubCategories.server";
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
  getProductCategory,
  type NewProductCategory,
  type ProductCategoryWithDetails,
  upsertProductCategory,
} from "~/models/productCategories.server";
import WindowContainer from "~/components/Layout/Containers/WindowContainer";

const validateOptions = {
  name: true,
  department: true,
  discountPercentage: true,
  bannerImage: true,
  tileImage: true,
};

export const productCategoryUpsertLoader = async (
  request: Request,
  params: Params<string>
) => {
  let { searchParams } = new URL(request.url);
  let id = searchParams.get("contentId");

  const departments = await getDepartments();
  const productSubCategories = await getProductSubCategories();
  const articleCategories = await getArticleCategories();

  if (id === "add") {
    const productCategory = {};
    return json({ productCategory } as {
      productCategory: ProductCategoryWithDetails;
      departments: DepartmentWithDetails[];
      productSubCategories: ProductSubCategoryWithDetails[];
      articleCategories: ArticleCategoryWithDetails[];
    });
  }

  if (!id) {
    throw new Response(null, {
      status: 404,
      statusText: "Product Category Not Found",
    });
  }

  const productCategory = await getProductCategory(id);

  return json({
    productCategory,
    departments,
    productSubCategories,
    articleCategories,
  });
};

export const productCategoryUpsertAction = async (
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

  const {
    name,
    index,
    department,
    displayInNavigation,
    isActive,
    articleCategories,
    productSubCategories,
  } = formEntries;

  switch (formEntries._action) {
    case "upsert":
      if (formErrors) {
        return json({ serverValidationErrors: formErrors });
      }

      const categoryData: NewProductCategory = {
        name: name as string,
        index: parseInt(index as string),
        department: department as string,
        displayInNavigation: displayInNavigation ? true : false,
        isActive: isActive ? true : false,
        productSubCategories:
          productSubCategories && JSON.parse(productSubCategories as string),
        articleCategories:
          articleCategories && JSON.parse(articleCategories as string),
        id: id,
      };

      await upsertProductCategory(categoryData);

      notification = {
        type: "success",
        message: `Category ${id === "add" ? "Added" : "Updated"}.`,
      };

      return json({ success: true, notification });
  }
};

type Props = {
  offRouteModule?: boolean;
};

const ProductCategoryUpsert = ({ offRouteModule }: Props) => {
  const { productCategory, departments, productSubCategories } =
    useLoaderData<typeof productCategoryUpsertLoader>();

  const { success, serverValidationErrors, notification } =
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
        action: `/admin/upsert/productCategory?contentId=${contentId}`,
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
        hasIsActive={true}
        title="Category"
        hasMode={true}
        children={
          <Form
            method="POST"
            onSubmit={handleSubmit}
            className="scrollbar-hide relative w-[500px] max-w-full overflow-y-auto"
          >
            <div className="form-control gap-3">
              <BasicInput
                name="name"
                label="Name"
                placeholder="Name"
                customWidth="w-full"
                type="text"
                defaultValue={productCategory?.name || ""}
                validationErrors={
                  serverValidationErrors || clientValidationErrors
                }
              />

              <BasicSelect
                name="department"
                label="Department"
                selections={departments}
                placeholder="Department"
                customWidth="w-full"
                defaultValue={productCategory?.department?.id.toString()}
              />

              <BasicInput
                label="Index"
                type="number"
                name="index"
                placeholder="Index"
                customWidth="w-full"
                defaultValue={productCategory?.index || 0}
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
                  productCategory?.displayInNavigation ? "yes" : "no"
                }
              />

              {productSubCategories && (
                <BasicMultiSelect
                  name="productSubCategories"
                  label="Sub Categories"
                  customWidth="w-full"
                  selections={productSubCategories.filter(
                    (e) =>
                      !e.productCategoryId ||
                      e.productCategoryId === productCategory?.id
                  )}
                  defaultValues={productCategory?.productSubCategories}
                />
              )}
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

export default ProductCategoryUpsert;
