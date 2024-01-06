import { type FormEvent, useEffect, useState } from "react";
import { tokenAuth } from "~/auth.server";
import type { Image } from "@prisma/client";
import { getBrands } from "~/models/brands.server";
import { getFormData } from "~/helpers/formHelpers";
import { STAFF_SESSION_KEY } from "~/session.server";
import DarkOverlay from "~/components/Layout/Overlays/DarkOverlay";
import BasicInput from "~/components/Forms/Input/BasicInput";
import { getDepartments } from "~/models/departments.server";
import type { ActionReturnTypes } from "~/utility/actionTypes";
import BasicSelect from "~/components/Forms/Select/BasicSelect";
import SelectGender from "~/components/Forms/Select/SelectGender";
import { validateForm, type ValidationErrors } from "~/utility/validate";
import BasicMultiSelect from "~/components/Forms/Select/BasicMultiSelect";
import BackSubmitButtons from "~/components/Forms/Buttons/BackSubmitButtons";
import { getProductSubCategories } from "~/models/productSubCategories.server";
import UploadImageCollapse from "~/components/Forms/Upload/UploadImageCollapse";
import useNotification, {
  type PageNotification,
} from "~/hooks/PageNotification";
import { json, redirect } from "@remix-run/node";
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
  getCampaign,
  type CampaignWithContent,
  type NewCampaign,
  upsertCampaign,
} from "~/models/campaigns.server";
import WindowContainer from "~/components/Layout/Containers/WindowContainer";

const validateOptions = {
  name: true,
  department: true,
  productSubCategories: true,
  brands: true,
  minSaleRange: true,
  maxSaleRange: true,
  gender: true,
  bannerImage: true,
  tileImage: true,
};

export const campaignUpsertLoader = async (
  request: Request,
  params: Params<string>
) => {
  let { searchParams } = new URL(request.url);
  let id = searchParams.get("contentId");

  if (!id) {
    throw new Response(null, {
      status: 404,
      statusText: "Campaign Not Found",
    });
  }

  const departments = await getDepartments();
  const productSubCategories = await getProductSubCategories();
  const brands = await getBrands();

  if (!departments || !productSubCategories || !brands) {
    throw new Response(null, {
      status: 404,
      statusText: "Error Retrieving Supporting Resources",
    });
  }

  const campaign =
    id === "add" ? ({} as CampaignWithContent) : await getCampaign(id);

  if (!campaign) {
    throw new Response(null, {
      status: 404,
      statusText: "Campaign Not Found",
    });
  }

  return json({ campaign, departments, productSubCategories, brands });
};

export const campaignUpsertAction = async (
  request: Request,
  params: Params<string>
) => {
  const authenticated = await tokenAuth(request, STAFF_SESSION_KEY);

  if (!authenticated.valid) {
    return redirect("/login");
  }

  const id = params.id === "add" ? undefined : params.id;

  const { formEntries, formErrors } = validateForm(
    await request.formData(),
    validateOptions
  );

  const {
    name,
    department,
    productSubCategories,
    brands,
    minSaleRange,
    maxSaleRange,
    gender,
    bannerImage,
    tileImage,
    isActive,
  } = formEntries;

  let notification: PageNotification;

  switch (formEntries._action) {
    case "upsert":
      if (formErrors) {
        return json({ serverValidationErrors: formErrors });
      }

      const parsedBanner = bannerImage
        ? (JSON.parse(bannerImage?.toString()) as Image)
        : undefined;

      const parsedTile = tileImage
        ? (JSON.parse(tileImage?.toString()) as Image)
        : undefined;

      const updateData: NewCampaign = {
        name: name as string,
        department: department as string,
        productSubCategories:
          productSubCategories && JSON.parse(productSubCategories as string),
        brands: brands && JSON.parse(brands as string),
        minSaleRange: minSaleRange as string,
        maxSaleRange: maxSaleRange as string,
        gender: gender as string,
        parsedBanner: parsedBanner as Image,
        parsedTile: parsedTile as Image,
        isActive: isActive ? true : false,
        id: id,
      };

      await upsertCampaign(updateData);

      notification = {
        type: "success",
        message: `Campaign ${id === "add" ? "Added" : "Updated"}.`,
      };

      return json({ success: true, notification });

    case "delete":
      notification = {
        type: "warning",
        message: "Campaign Deleted",
      };

      return json({ success: true, notification });
  }
};

type Props = {
  offRouteModule?: boolean;
};

const CampaignUpsert = ({ offRouteModule }: Props) => {
  const { campaign, departments, productSubCategories, brands } =
    useLoaderData<typeof campaignUpsertLoader>() || {};
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
        action: `/admin/upsert/campaign?contentId=${contentId}`,
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
        isActive={campaign?.isActive}
        title="Campaign"
        hasIsActive={true}
        hasDelete={true}
        hasMode={true}
        children={
          <Form
            method="POST"
            onSubmit={handleSubmit}
            className="scrollbar-hide relative w-[600px] max-w-full overflow-y-auto"
          >
            <div className="form-control">
              <div className="form-control gap-3">
                <div className="flex flex-wrap justify-evenly gap-3">
                  <BasicInput
                    label="Name"
                    type="text"
                    name="name"
                    placeholder="Name"
                    defaultValue={campaign?.name || ""}
                    validationErrors={
                      serverValidationErrors || clientValidationErrors
                    }
                  />

                  <BasicSelect
                    name="department"
                    label="Department"
                    selections={departments}
                    placeholder="Department"
                    defaultValue={campaign?.department?.id.toString()}
                  />
                </div>

                <div className="divider w-full pt-4" />

                <div className="text-center">Campaign Filters</div>

                <div className="flex flex-wrap justify-evenly gap-3">
                  <BasicMultiSelect
                    name="productSubCategories"
                    label="Categories"
                    selections={productSubCategories}
                    defaultValues={campaign?.productSubCategories}
                  />

                  <BasicMultiSelect
                    name="brands"
                    label="Targets Brands?"
                    selections={brands}
                    defaultValues={campaign?.brands}
                  />
                </div>

                <div className="flex flex-wrap justify-evenly gap-3">
                  <BasicInput
                    label="Min Discount Range %"
                    type="number"
                    name="minSaleRange"
                    placeholder="Discount %"
                    defaultValue={campaign?.minSaleRange || ""}
                    validationErrors={
                      serverValidationErrors || clientValidationErrors
                    }
                  />

                  <BasicInput
                    label="Max Discount Range %"
                    type="number"
                    name="maxSaleRange"
                    placeholder="Discount %"
                    defaultValue={campaign?.maxSaleRange || ""}
                    validationErrors={
                      serverValidationErrors || clientValidationErrors
                    }
                  />
                </div>

                <div className="flex flex-wrap justify-evenly gap-3">
                  <SelectGender
                    defaultValue={campaign?.targetGender}
                    label="Has Target Gender?"
                  />

                  <div className="w-[95vw] sm:w-[215px]" />
                </div>
              </div>

              <div className="divider w-full pt-8" />

              <UploadImageCollapse
                name="bannerImage"
                label="Banner Image"
                tooltip="Optimal 8.09:1 Aspect Ratio"
                defaultValue={campaign?.bannerImage}
              />

              <div className="divider w-full pt-4" />

              <UploadImageCollapse
                name="tileImage"
                label="Tile Image"
                tooltip="Optimal Square Image"
                defaultValue={campaign?.tileImage}
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

export default CampaignUpsert;
