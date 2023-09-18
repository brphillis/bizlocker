import { type LoaderArgs, type ActionArgs } from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigate,
} from "@remix-run/react";
import { useEffect, useState } from "react";
import BackSubmitButtons from "~/components/Forms/Buttons/BackSubmitButtons";
import FormHeader from "~/components/Forms/Headers/FormHeader";
import SelectBrands from "~/components/Forms/Select/SelectBrands";
import SelectDepartment from "~/components/Forms/Select/SelectDepartment";
import SelectGender from "~/components/Forms/Select/SelectGender";
import SelectProductSubCategories from "~/components/Forms/Select/SelectProductSubCategories";
import UploadBannerImage from "~/components/Forms/Upload/UploadBannerImage";
import UploadTileImage from "~/components/Forms/Upload/UploadTileImage";
import DarkOverlay from "~/components/Layout/DarkOverlay";
import { getBrands } from "~/models/brands.server";
import { getCampaign, upsertCampaign } from "~/models/campaigns.server";
import { getDepartments } from "~/models/departments.server";
import { getProductSubCategories } from "~/models/productSubCategories.server";

export const loader = async ({ params }: LoaderArgs) => {
  const id = params?.id;
  const departments = await getDepartments();
  const productSubCategories = await getProductSubCategories();
  const brands = await getBrands();
  let campaign;

  if (id && id !== "add") {
    campaign = await getCampaign(id);
  }

  return { campaign, departments, productSubCategories, brands };
};

export const action = async ({ request, params }: ActionArgs) => {
  const id = params.id === "add" ? undefined : params.id;
  const form = Object.fromEntries(await request.formData());
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
  } = form;

  let validationError: string[] = [];

  if (!name) {
    validationError.push("Name is Required");
  }

  if (!department) {
    validationError.push("Department is Required");
  }

  if (!minSaleRange || !maxSaleRange) {
    validationError.push("Sale Ranges are Required");
  }

  if (validationError.length > 0) {
    return { validationError };
  }

  switch (form._action) {
    case "upsert":
      const parsedBanner = bannerImage
        ? (JSON.parse(bannerImage?.toString()) as Image)
        : undefined;

      const parsedTile = tileImage
        ? (JSON.parse(tileImage?.toString()) as Image)
        : undefined;

      const updateData = {
        name: name as string,
        department: department as string,
        productSubCategories:
          productSubCategories && JSON.parse(productSubCategories as string),
        brands: brands && JSON.parse(brands as string),
        minSaleRange: minSaleRange as string,
        maxSaleRange: maxSaleRange as string,
        gender: gender as string,
        parsedBanner: parsedBanner,
        parsedTile: parsedTile,
        isActive: isActive ? true : false,
        id: id,
      };

      await upsertCampaign(updateData);

      return { success: true };

    case "delete":
      return { success: true };
  }
};

const ModifyCampaign = () => {
  const navigate = useNavigate();
  const { campaign, departments, productSubCategories, brands } =
    useLoaderData() || {};
  const { validationError, success } =
    (useActionData() as { success: boolean; validationError: string[] }) || {};
  const mode = campaign ? "edit" : "add";

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
        className="scrollbar-hide relative w-[600px] max-w-full overflow-y-auto bg-base-200 px-3 py-6 sm:px-6"
      >
        <FormHeader
          valueToChange={campaign}
          type="Campaign"
          mode={mode}
          hasIsActive={true}
          hasDelete={true}
        />

        <div className="form-control">
          <div className="form-control gap-3">
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
                  defaultValue={campaign?.name || undefined}
                />
              </div>

              <SelectDepartment
                departments={departments}
                defaultValue={campaign?.department?.id.toString()}
              />
            </div>

            <div className="divider w-full pt-4" />

            <div className="text-center">Campaign Filters</div>

            <div className="flex flex-wrap justify-evenly gap-3">
              <SelectProductSubCategories
                productSubCategories={productSubCategories}
                valueToChange={campaign}
                title="Targets Categories?"
              />

              <SelectBrands
                brands={brands}
                valueToChange={campaign}
                title="Targets Brands?"
              />
            </div>

            <div className="flex flex-wrap justify-evenly gap-3">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Min Discount Range %</span>
                </label>
                <input
                  name="minSaleRange"
                  type="number"
                  placeholder="Discount %"
                  className="input input-bordered w-[95vw] sm:w-[215px]"
                  defaultValue={campaign?.minSaleRange || ""}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Max Discount Range %</span>
                </label>
                <input
                  name="maxSaleRange"
                  type="number"
                  placeholder="Discount %"
                  className="input input-bordered w-[95vw] sm:w-[215px]"
                  defaultValue={campaign?.maxSaleRange || ""}
                />
              </div>
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

          <UploadBannerImage valueToChange={campaign} />

          <div className="divider w-full pt-4" />

          <UploadTileImage valueToChange={campaign} />
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

export default ModifyCampaign;
