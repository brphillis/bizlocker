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
import BackSubmitButtons from "~/components/Forms/Buttons/BackSubmitButtons";
import FormHeader from "~/components/Forms/Headers/FormHeader";
import SelectDepartment from "~/components/Forms/Select/SelectDepartment";
import SelectGender from "~/components/Forms/Select/SelectGender";
import UploadBannerImage from "~/components/Forms/Upload/UploadBannerImage";
import UploadTileImage from "~/components/Forms/Upload/UploadTileImage";
import DarkOverlay from "~/components/Layout/DarkOverlay";
import { getDepartments } from "~/models/departments.server";
import { getPromotion, upsertPromotion } from "~/models/promotions.server";

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

      await upsertPromotion(updateData);

      return redirect("/admin/promotions");

    case "delete":
      return redirect("/admin/promotions");
  }
};

const ModifyPromotion = () => {
  const navigate = useNavigate();
  const { promotion, departments } = useLoaderData();

  const { products } = (promotion as { products: Product[] }) || {};

  const { validationError } =
    (useActionData() as { validationError: string }) || {};
  const mode = promotion ? "edit" : "add";

  return (
    <DarkOverlay>
      <Form
        method="POST"
        className="scrollbar-hide relative w-[600px] overflow-y-auto bg-base-200 px-3 py-6 sm:px-6"
      >
        <FormHeader
          valueToChange={promotion}
          type="Promotion"
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
                  defaultValue={promotion?.name || undefined}
                />
              </div>

              <SelectDepartment
                departments={departments}
                defaultValue={promotion?.department?.id.toString()}
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
                  className="input input-bordered w-[95vw] sm:w-[215px]"
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
            <table className="table table-md">
              <thead>
                <tr>
                  <th></th>
                  <th>Name</th>
                  <th>Gender</th>
                  <th>Active</th>
                </tr>
              </thead>
              <tbody>
                {products?.map((product: Product, i) => {
                  const { id, name, gender, isActive } = product || {};

                  return (
                    <tr
                      key={"product_" + (name || i)}
                      className="hover cursor-pointer"
                      onClick={() => navigate(`/admin/products/${id}`)}
                    >
                      <th>{i + 1}</th>
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

          <UploadBannerImage valueToChange={promotion} />

          <div className="divider w-full pt-4" />

          <UploadTileImage valueToChange={promotion} />

          {validationError && (
            <p className="h-0 py-3 text-center text-sm text-red-500/75">
              {validationError}
            </p>
          )}
        </div>

        <BackSubmitButtons />
      </Form>
    </DarkOverlay>
  );
};

export default ModifyPromotion;
