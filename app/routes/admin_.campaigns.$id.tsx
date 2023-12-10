import type { Image } from "@prisma/client";
import {
  type LoaderArgs,
  type ActionArgs,
  redirect,
  json,
} from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigate,
} from "@remix-run/react";
import { useEffect, useState } from "react";
import { tokenAuth } from "~/auth.server";
import BackSubmitButtons from "~/components/Forms/Buttons/BackSubmitButtons";
import FormHeader from "~/components/Forms/Headers/FormHeader";
import BasicInput from "~/components/Forms/Input/BasicInput";
import BasicMultiSelect from "~/components/Forms/Select/BasicMultiSelect";
import BasicSelect from "~/components/Forms/Select/BasicSelect";
import SelectGender from "~/components/Forms/Select/SelectGender";
import UploadImageCollapse from "~/components/Forms/Upload/UploadImageCollapse";
import DarkOverlay from "~/components/Layout/DarkOverlay";
import { getBrands } from "~/models/brands.server";
import { getCampaign, upsertCampaign } from "~/models/campaigns.server";
import { getDepartments } from "~/models/departments.server";
import { getProductSubCategories } from "~/models/productSubCategories.server";
import { STAFF_SESSION_KEY } from "~/session.server";
import { validateForm } from "~/utility/validate";

export const loader = async ({ request, params }: LoaderArgs) => {
  const authenticated = await tokenAuth(request, STAFF_SESSION_KEY);

  if (!authenticated.valid) {
    return redirect("/login");
  }

  const id = params?.id;

  if (!id) {
    throw new Response(null, {
      status: 404,
      statusText: "Campaign Not Found",
    });
  }

  const departments = await getDepartments();
  const productSubCategories = await getProductSubCategories();
  const brands = await getBrands();
  let campaign = null;

  if (!departments || !productSubCategories || !brands) {
    throw new Response(null, {
      status: 404,
      statusText: "Error Retrieving Supporting Resources",
    });
  }

  if (id !== "add") {
    campaign = await getCampaign(id);
  }

  if (!campaign) {
    throw new Response(null, {
      status: 404,
      statusText: "Campaign Not Found",
    });
  }

  return json({ campaign, departments, productSubCategories, brands });
};

export const action = async ({ request, params }: ActionArgs) => {
  const authenticated = await tokenAuth(request, STAFF_SESSION_KEY);

  if (!authenticated.valid) {
    return redirect("/login");
  }

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

  switch (form._action) {
    case "upsert":
      const validate = {
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

      const validationErrors = validateForm(form, validate);
      if (validationErrors) {
        return json({ validationErrors });
      }

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

      return json({ success: true });

    case "delete":
      return json({ success: true });
  }
};

const ModifyCampaign = () => {
  const { campaign, departments, productSubCategories, brands } =
    useLoaderData<typeof loader>();
  const { validationErrors, success } = useActionData() as ActionReturnTypes;

  const navigate = useNavigate();

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
          hasIsActive={true}
          hasDelete={true}
        />

        <div className="form-control">
          <div className="form-control gap-3">
            <div className="flex flex-wrap justify-evenly gap-3">
              <BasicInput
                label="Name"
                type="text"
                name="name"
                placeholder="Name"
                defaultValue={campaign?.name || ""}
                validationErrors={validationErrors}
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
                validationErrors={validationErrors}
              />

              <BasicInput
                label="Max Discount Range %"
                type="number"
                name="maxSaleRange"
                placeholder="Discount %"
                defaultValue={campaign?.maxSaleRange || ""}
                validationErrors={validationErrors}
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
          validationErrors={validationErrors}
        />
      </Form>
    </DarkOverlay>
  );
};

export default ModifyCampaign;
