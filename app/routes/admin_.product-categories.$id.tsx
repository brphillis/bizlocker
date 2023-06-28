import { useState } from "react";
import { ConvertToBase64 } from "~/utility/fileHelpers";
import { capitalizeFirst } from "~/utility/stringHelpers";
import { IoIosCloseCircle } from "react-icons/io";
import {
  json,
  redirect,
  type ActionArgs,
  type LoaderArgs,
} from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigate,
} from "@remix-run/react";
import {
  deleteProductCategory,
  getProductCategory,
  upsertProductCategory,
} from "~/models/productCategories.server";

export const loader = async ({ params }: LoaderArgs) => {
  const id = params?.id;
  const productCategory = id && id !== "add" && (await getProductCategory(id));
  return json(productCategory);
};

export const action = async ({ request, params }: ActionArgs) => {
  const id = params.id === "add" ? undefined : params.id;
  const form = Object.fromEntries(await request.formData());
  const { name, image } = form;

  switch (form._action) {
    case "upsert":
      if (!name || name.length < 3) {
        const validationError = "name must be at least 3 chars.";
        return { validationError };
      }

      const parsedImage = image
        ? (JSON.parse(image?.toString()) as Image)
        : undefined;

      await upsertProductCategory(name as string, parsedImage, id);

      return redirect("/admin/product-categories");

    case "delete":
      await deleteProductCategory(id as string);
      return redirect("/admin/product-categories");
  }
};

const ModifyProductCategory = () => {
  const navigate = useNavigate();
  const productCategory = useLoaderData() as ProductCategory;
  const { validationError } =
    (useActionData() as { validationError: string }) || {};
  const mode = productCategory ? "edit" : "add";

  const [image, setImage] = useState<Image | undefined>(productCategory?.image);

  return (
    <div className="absolute inset-0 flex h-[100vh] w-[100vw] flex-col items-center justify-center bg-black/80">
      <Form
        method="POST"
        className="relative max-h-[calc(100vh-64px)] max-w-[99vw] rounded-lg border-t-4 border-primary bg-base-300 p-6"
      >
        <div className="flex flex-row justify-between">
          <h1>{mode && capitalizeFirst(mode)} Product Category</h1>
        </div>

        <div className="divider w-full" />

        <div className="form-control w-full max-w-xs gap-3">
          <div className="form-control w-full max-w-xs ">
            <label className="label">
              <span className="label-text">Name</span>
            </label>
            <input
              name="name"
              type="text"
              placeholder="Name"
              className="input-bordered input w-full max-w-xs"
              defaultValue={productCategory?.name || undefined}
            />
          </div>

          {image && (
            <div className="relative my-6 flex flex-col items-center">
              <div className="relative h-max w-max">
                <img
                  src={image.url}
                  className="h-36 w-36 rounded-lg object-cover"
                  alt="brandImageEditor"
                />

                <IoIosCloseCircle
                  onClick={() => setImage(undefined)}
                  size={28}
                  className="
                  absolute right-0 top-0
                  -mr-2 -mt-2 cursor-pointer
                  rounded-full bg-white text-primary
                "
                />
              </div>
            </div>
          )}

          <input
            name="imageUpload"
            type="file"
            accept="image/*"
            className="file-input-bordered file-input w-full"
            onChange={async (e) => {
              const convertedImage = await ConvertToBase64(e);
              convertedImage && setImage(convertedImage);
            }}
          />
          <input
            type="hidden"
            name="image"
            value={JSON.stringify(image) || ""}
          />

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

export default ModifyProductCategory;
