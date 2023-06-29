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
import SelectDepartment from "~/components/Forms/SelectDepartment";
import SelectGender from "~/components/Forms/SelectGender";
import { getDepartments } from "~/models/departments.server";
import { getPromotion, upsertPromotion } from "~/models/promotions.server";
import { ConvertToBase64 } from "~/utility/fileHelpers";
import { capitalizeFirst } from "~/utility/stringHelpers";

export const loader = async ({ params }: LoaderArgs) => {
  const id = params?.id;
  const departments = await getDepartments();
  let promotion;

  if (id && id !== "add") {
    promotion = await getPromotion(id);
  }

  return json({ promotion, departments });
};

export const action = async ({ request, params }: ActionArgs) => {
  const id = params.id === "add" ? undefined : params.id;
  const form = Object.fromEntries(await request.formData());
  const {
    name,
    department,
    products,
    discountPercentage,
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
        parsedBanner: parsedBanner,
        parsedTile: parsedTile,
        name: name as string,
        department: department as string,
        products: products && JSON.parse(products as string),
        discountPercentage: discountPercentage as string,
        gender: gender as string,
        isActive: isActive ? true : false,
        id: id,
      };

      upsertPromotion(updateData);

      console.log("UPDATE", products);

      return redirect("/admin/promotions");

    case "delete":
      // await deleteBrand(id as string);
      return redirect("/admin/promotions");
  }
};

const ModifyPromotion = () => {
  const navigate = useNavigate();
  const { promotion, departments } =
    (useLoaderData() as {
      promotion: Promotion;
      departments: Department[];
    }) || {};

  const { products } = (promotion as { products: Product[] }) || {};

  const { validationError } =
    (useActionData() as { validationError: string }) || {};
  const mode = promotion ? "edit" : "add";

  const [bannerImage, setBannerImage] = useState<Image | undefined>(
    promotion?.bannerImage
  );
  const [tileImage, setTileImage] = useState<Image | undefined>(
    promotion?.tileImage
  );
  const [isActive, setisActive] = useState<string | undefined>(
    mode === "add" ? " " : promotion?.isActive ? " " : ""
  );

  return (
    <div className="absolute inset-0 flex h-max min-h-screen max-w-[100vw] flex-col items-center justify-start bg-black/80 py-3">
      <Form
        method="POST"
        className="relative w-[600px] max-w-[99vw] rounded-lg border-t-4 border-primary bg-base-300 p-6"
      >
        <div className="flex flex-row justify-between">
          <h1>{mode && capitalizeFirst(mode)} Promotion</h1>

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
                  defaultValue={promotion?.name || undefined}
                />
              </div>

              <SelectDepartment
                departments={departments}
                defaultValue={promotion?.department?.name}
                valueToChange={promotion}
              />
            </div>

            <div className="divider w-full pt-4" />

            <div className="text-center">Promotion Paramters</div>

            <div className="flex flex-wrap justify-evenly gap-3">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Discount %</span>
                </label>
                <input
                  name="discountPercentage"
                  type="number"
                  placeholder="Discount %"
                  className="input-bordered input w-[95vw] sm:w-[215px]"
                  defaultValue={promotion?.discountPercentage || ""}
                />
              </div>

              <SelectGender
                defaultValue={promotion?.targetGender}
                label="Has Target Gender?"
              />
            </div>
          </div>

          <div className="divider w-full pt-8" />

          <div className="max-w-full overflow-x-auto sm:max-w-none">
            <table className="table-md table">
              <thead>
                <tr>
                  <th></th>
                  <th>Name</th>
                  <th>Gender</th>
                  <th>Active</th>
                </tr>
              </thead>
              <tbody>
                {products?.map((product: Product, index) => {
                  const { id, name, gender, isActive } = product || {};

                  return (
                    <tr
                      key={"product_" + (name || index)}
                      className="hover cursor-pointer"
                      onClick={() => navigate(`/admin/products/${id}`)}
                    >
                      <th>{index + 1}</th>
                      <td>{name}</td>
                      <td>{gender}</td>

                      <td>
                        {!isActive && (
                          <div className="ml-4 h-3 w-3 rounded-full bg-red-500" />
                        )}
                        {isActive && (
                          <div className="ml-4 h-3 w-3 self-center rounded-full bg-success" />
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <input
              type="hidden"
              name="products"
              value={JSON.stringify(products) || ""}
            />
          </div>

          <div className="divider w-full pt-8" />

          <div className="collapse-arrow collapse mt-6 bg-base-200">
            <input type="checkbox" />
            <div className="collapse-title ml-3 mt-1 h-max text-center text-sm font-medium">
              Banner Image
            </div>
            <div className="collapse-content">
              <div className="flex flex-col items-center">
                <div className="text-center text-xs">
                  Optimal 8.09:1 Aspect Ratio
                </div>

                {bannerImage && (
                  <div className="relative mt-3 flex flex-col items-center">
                    <div className="relative h-max w-max">
                      <img
                        src={bannerImage.url}
                        className="my-3 h-36 max-w-[280px] rounded-lg object-contain sm:max-w-[30rem]"
                        alt="brandImageEditor"
                      />

                      <IoIosCloseCircle
                        onClick={() => setBannerImage(undefined)}
                        size={18}
                        className="absolute right-0 top-0 -mr-2 mt-1 cursor-pointer rounded-full bg-white text-primary"
                      />
                    </div>
                  </div>
                )}

                <input
                  name="bannerImageUpload"
                  type="file"
                  accept="image/*"
                  className="file-input-bordered file-input mt-3 w-[120px] sm:w-[440px]"
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
            </div>
          </div>

          <div className="divider w-full pt-4" />

          <div className="collapse-arrow collapse mt-6 bg-base-200">
            <input type="checkbox" />
            <div className="collapse-title ml-3 mt-1 h-max text-center text-sm font-medium">
              Tile Image
            </div>
            <div className="collapse-content">
              <div className="flex flex-col items-center">
                <div className="text-center text-xs">Optimal Square Size</div>

                {tileImage && (
                  <div className="relative mt-3 flex flex-col items-center">
                    <div className="relative h-max w-max">
                      <img
                        src={tileImage.url}
                        className="my-3 h-36 max-w-[280px] rounded-lg object-contain sm:max-w-[30rem]"
                        alt="brandImageEditor"
                      />

                      <IoIosCloseCircle
                        onClick={() => setTileImage(undefined)}
                        size={18}
                        className="absolute right-0 top-0 -mr-2 mt-1 cursor-pointer rounded-full bg-white text-primary"
                      />
                    </div>
                  </div>
                )}

                <input
                  name="tileImageUpload"
                  type="file"
                  accept="image/*"
                  className="file-input-bordered file-input mt-3 w-[120px] sm:w-[440px]"
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
            </div>
          </div>

          <div className="divider w-full pt-4" />

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

export default ModifyPromotion;
