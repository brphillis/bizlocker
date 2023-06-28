import {
  json,
  redirect,
  type LoaderArgs,
  type ActionArgs,
} from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigate,
} from "@remix-run/react";
import { useState } from "react";
import { IoIosCloseCircle, IoMdTrash } from "react-icons/io";
import SelectBrands from "~/components/Forms/SelectBrands";
import SelectDepartment from "~/components/Forms/SelectDepartment";
import SelectGender from "~/components/Forms/SelectGender";
import SelectProductCategories from "~/components/Forms/SelectProductCategories";
import { getBrands } from "~/models/brands.server";
import { getCampaign, upsertCampaign } from "~/models/campaigns.server";
import { getDepartments } from "~/models/departments.server";
import { getProductCategories } from "~/models/productCategories.server";
import { ConvertToBase64 } from "~/utility/fileHelpers";
import { capitalizeFirst } from "~/utility/stringHelpers";

export const loader = async ({ params }: LoaderArgs) => {
  const id = params?.id;
  const departments = await getDepartments();
  const productCategories = await getProductCategories();
  const brands = await getBrands();
  let campaign;

  if (id && id !== "add") {
    campaign = await getCampaign(id);
  }

  return json({ campaign, departments, productCategories, brands });
};

export const action = async ({ request, params }: ActionArgs) => {
  const id = params.id === "add" ? undefined : params.id;
  const form = Object.fromEntries(await request.formData());
  const {
    name,
    department,
    productCategories,
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
      if (!name || name.length < 3) {
        const validationError = "name must be at least 3 chars.";
        return { validationError };
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
        productCategories:
          productCategories && JSON.parse(productCategories as string),
        brands: brands && JSON.parse(brands as string),
        minSaleRange: minSaleRange as string,
        maxSaleRange: maxSaleRange as string,
        gender: gender as string,
        parsedBanner: parsedBanner,
        parsedTile: parsedTile,
        isActive: isActive ? true : false,
        id: id,
      };

      upsertCampaign(updateData);

      return redirect("/admin/campaigns");

    case "delete":
      // await deleteBrand(id as string);
      return redirect("/admin/campaigns");
  }
};

const ModifyCampaign = () => {
  const navigate = useNavigate();
  const { campaign, departments, productCategories, brands } =
    (useLoaderData() as {
      campaign: Campaign;
      departments: Department[];
      productCategories: ProductCategory[];
      brands: Brand[];
    }) || {};
  const { validationError } =
    (useActionData() as { validationError: string }) || {};
  const mode = campaign ? "edit" : "add";

  const [bannerImage, setBannerImage] = useState<Image | undefined>(
    campaign?.bannerImage
  );
  const [tileImage, setTileImage] = useState<Image | undefined>(
    campaign?.tileImage
  );
  const [isActive, setisActive] = useState<string | undefined>(
    mode === "add" ? " " : campaign?.isActive ? " " : ""
  );

  return (
    <div className="absolute inset-0 flex h-max max-w-[100vw] flex-col items-center justify-start bg-black/80 py-3">
      <Form
        method="POST"
        className="relative w-[600px] max-w-[99vw] rounded-lg border-t-4 border-primary bg-base-300 p-6"
      >
        <div className="flex flex-row justify-between">
          <h1>{mode && capitalizeFirst(mode)} Campaign</h1>

          <label className="label absolute right-16 mt-[6px] h-1 cursor-pointer">
            <input
              type="checkbox"
              className="toggle-success toggle ml-3"
              checked={isActive ? true : false}
              onChange={(e) =>
                setisActive(e.target.checked ? "true" : undefined)
              }
            />
            <span className="label-text ml-3">Active</span>
          </label>
          <input name="isActive" value={isActive || ""} readOnly hidden />

          <button
            type="submit"
            name="_action"
            value="delete"
            className="relative w-max rounded-full bg-red-500 p-1 text-white"
          >
            <IoMdTrash size={18} />
          </button>
        </div>

        <div className="divider w-full pt-4" />

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
                  className="input-bordered input w-[95vw] sm:w-[215px]"
                  defaultValue={campaign?.name || undefined}
                />
              </div>

              <SelectDepartment
                departments={departments}
                defaultValue={campaign?.department?.name}
                valueToChange={campaign}
              />
            </div>

            <div className="divider w-full pt-4" />

            <div className="text-center">Campaign Filters</div>

            <div className="flex flex-wrap justify-evenly gap-3">
              <SelectProductCategories
                productCategories={productCategories}
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
                  className="input-bordered input w-[95vw] sm:w-[215px]"
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
                  className="input-bordered input w-[95vw] sm:w-[215px]"
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

          <div className="text-center">
            <div>Banner Image</div>
            <div className="text-xs">Optimal 8.09:1 Aspect Ratio</div>

            {bannerImage && (
              <div className="relative mt-3 flex flex-col items-center">
                <div className="relative h-max w-max">
                  <img
                    src={bannerImage.url}
                    className="h-36 max-w-[35rem] rounded-lg object-cover"
                    alt="brandImageEditor"
                  />

                  <IoIosCloseCircle
                    onClick={() => setBannerImage(undefined)}
                    size={18}
                    className="
                  absolute right-0 top-0
                  -mr-1 -mt-1 cursor-pointer
                  rounded-full bg-white text-primary
                "
                  />
                </div>
              </div>
            )}

            <input
              name="bannerImageUpload"
              type="file"
              accept="image/*"
              className="file-input-bordered file-input mt-3 w-[95vw] sm:w-[440px]"
              onChange={async (e) => {
                const convertedImage = await ConvertToBase64(e);
                convertedImage && setBannerImage(convertedImage);
              }}
            />
            <input
              type="hidden"
              name="bannerImage"
              value={JSON.stringify(bannerImage) || ""}
            />
          </div>

          <div className="divider w-full pt-4" />

          <div className="text-center">
            <div>Tile Image</div>
            <div className="text-xs">Optimal Square Size</div>

            {tileImage && (
              <div className="relative mt-3 flex flex-col items-center">
                <div className="relative h-max w-max">
                  <img
                    src={tileImage.url}
                    className="h-52 w-52 rounded-lg object-cover"
                    alt="tileImageEditor"
                  />

                  <IoIosCloseCircle
                    onClick={() => setTileImage(undefined)}
                    size={18}
                    className="
                  absolute right-0 top-0
                  -mr-1 -mt-1 cursor-pointer
                  rounded-full bg-white text-primary
                "
                  />
                </div>
              </div>
            )}

            <input
              name="tileImageUpload"
              type="file"
              accept="image/*"
              className="file-input-bordered file-input mt-3 w-[95vw] sm:w-[440px]"
              onChange={async (e) => {
                const convertedImage = await ConvertToBase64(e);
                convertedImage && setTileImage(convertedImage);
              }}
            />
            <input
              type="hidden"
              name="tileImage"
              value={JSON.stringify(tileImage) || ""}
            />
          </div>

          {validationError && (
            <p className="h-0 py-3 text-center text-sm text-red-500/75">
              {validationError}
            </p>
          )}
        </div>

        <div className="flex flex-row justify-center gap-3">
          <button
            type="button"
            className="btn-primary btn mt-6 w-max"
            onClick={() => navigate("..")}
          >
            Back
          </button>
          <button
            type="submit"
            name="_action"
            value="upsert"
            className="btn-primary btn mt-6 w-max"
          >
            Submit
          </button>
        </div>
      </Form>
    </div>
  );
};

export default ModifyCampaign;
