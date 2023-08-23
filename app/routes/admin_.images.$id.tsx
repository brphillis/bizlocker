import { tokenAuth } from "~/auth.server";
import DarkOverlay from "~/components/Layout/DarkOverlay";
import FormHeader from "~/components/Forms/Headers/FormHeader";
import UploadImage from "~/components/Forms/Upload/UploadImage";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigate,
  useSubmit,
} from "@remix-run/react";
import BackSubmitButtons from "~/components/Forms/Buttons/BackSubmitButtons";
import { redirect, type ActionArgs, type LoaderArgs } from "@remix-run/node";
import { deleteImage, getImage, upsertImage } from "~/models/images.server";
import { IoCaretForwardCircleSharp } from "react-icons/io5";
import { handleResourceSubmit } from "~/utility/formHelpers";

export const loader = async ({ params }: LoaderArgs) => {
  const id = params?.id;

  if (id && id !== "add") {
    return await getImage(id);
  } else {
    return null;
  }
};

export const action = async ({ request, params }: ActionArgs) => {
  const authenticated = await tokenAuth(request);
  if (!authenticated.valid) {
    return redirect("/login");
  }
  const id = params.id === "add" ? undefined : params.id;
  const form = Object.fromEntries(await request.formData());
  const { altText, image } = form;

  switch (form._action) {
    case "upsert":
      if (!altText || altText.length < 3) {
        const validationError = "title must be at least 3 chars.";
        return { validationError };
      }

      const parsedImage = image
        ? (JSON.parse(image?.toString()) as Image)
        : undefined;

      upsertImage(altText as string, parsedImage, id);

      return redirect("/admin/images");

    case "delete":
      await deleteImage(id as string);
      return redirect("/admin/images");
  }
};

const ModifyImage = () => {
  const navigate = useNavigate();
  let submit = useSubmit();
  const image = useLoaderData();
  const { validationError } =
    (useActionData() as { validationError: string }) || {};
  const mode = image ? "edit" : "add";
  const {
    altText,
    promotionBanner,
    promotionTile,
    campaignBanner,
    campaignTile,
    brandId,
    productCategoryId,
    articleId,
    productId,
  } = image || ({} as Image);

  const determineIfConnected = (): boolean => {
    if (
      promotionBanner ||
      promotionTile ||
      campaignBanner ||
      campaignTile ||
      brandId ||
      productCategoryId ||
      articleId ||
      productId
    ) {
      return true;
    } else return false;
  };

  const isConnected = determineIfConnected();

  return (
    <DarkOverlay>
      <Form
        method="POST"
        className="relative w-max max-w-full rounded-none bg-base-200 px-3 py-6 max-md:w-screen sm:rounded-md lg:px-6"
        onSubmit={(e) => handleResourceSubmit(e, submit, isConnected)}
      >
        <FormHeader
          valueToChange={image}
          type="Image"
          mode={mode}
          hasIsActive={false}
          hasDelete={true}
        />

        <div className="form-control w-full items-center gap-3">
          <UploadImage defaultValue={image} />

          <div className="form-control w-full max-w-xs ">
            <label className="label">
              <span className="label-text">Title</span>
            </label>
            <input
              name="altText"
              type="text"
              placeholder="Title"
              className="input input-bordered w-full max-w-xs"
              defaultValue={altText || undefined}
            />
          </div>

          <div className="mt-6 text-sm">Existing Connections</div>

          <table className="table table-zebra table-sm">
            <thead>
              <tr>
                <th className="w-4/5">Type</th>
                <th className="w-1/5">Go To</th>
              </tr>
            </thead>
            <tbody>
              {promotionBanner && (
                <tr className="hover cursor-pointer">
                  <td className="w-4/5">Promotion Banner</td>
                  <td className="w-1/5">
                    <div
                      className="ml-2"
                      onClick={() =>
                        navigate(`/admin/promotions/${promotionBanner?.id}`)
                      }
                    >
                      <IoCaretForwardCircleSharp size={18} />
                    </div>
                  </td>
                </tr>
              )}
              {promotionTile && (
                <tr className="hover cursor-pointer">
                  <td className="w-4/5">Promotion Tile</td>
                  <td className="w-1/5">
                    <div
                      className="ml-2"
                      onClick={() =>
                        navigate(`/admin/promotions/${promotionTile?.id}`)
                      }
                    >
                      <IoCaretForwardCircleSharp size={18} />
                    </div>
                  </td>
                </tr>
              )}
              {campaignBanner && (
                <tr className="hover cursor-pointer">
                  <td className="w-4/5">Campaign Banner</td>
                  <td className="w-1/5">
                    <div
                      className="ml-2"
                      onClick={() =>
                        navigate(`/admin/promotions/${campaignBanner?.id}`)
                      }
                    >
                      <IoCaretForwardCircleSharp size={18} />
                    </div>
                  </td>
                </tr>
              )}
              {campaignTile && (
                <tr className="hover cursor-pointer">
                  <td className="w-4/5">Campaign Tile</td>
                  <td className="w-1/5">
                    <div
                      className="ml-2"
                      onClick={() =>
                        navigate(`/admin/promotions/${campaignTile?.id}`)
                      }
                    >
                      <IoCaretForwardCircleSharp size={18} />
                    </div>
                  </td>
                </tr>
              )}
              {brandId && (
                <tr className="hover cursor-pointer">
                  <td className="w-4/5">Brand Image</td>
                  <td className="w-1/5">
                    <div
                      className="ml-2"
                      onClick={() => navigate(`/admin/brands/${brandId}`)}
                    >
                      <IoCaretForwardCircleSharp size={18} />
                    </div>
                  </td>
                </tr>
              )}
              {productCategoryId && (
                <tr className="hover cursor-pointer">
                  <td className="w-4/5">Product Category Image</td>
                  <td className="w-1/5">
                    <div
                      className="ml-2"
                      onClick={() =>
                        navigate(
                          `/admin/product-categories/${productCategoryId}`
                        )
                      }
                    >
                      <IoCaretForwardCircleSharp size={18} />
                    </div>
                  </td>
                </tr>
              )}
              {productId && (
                <tr className="hover cursor-pointer">
                  <td className="w-4/5">Product Image</td>
                  <td className="w-1/5">
                    <div
                      className="ml-2"
                      onClick={() => navigate(`/admin/products/${productId}`)}
                    >
                      <IoCaretForwardCircleSharp size={18} />
                    </div>
                  </td>
                </tr>
              )}
              {articleId && (
                <tr className="hover cursor-pointer">
                  <td className="w-4/5">Article Image</td>
                  <td className="w-1/5">
                    <div
                      className="ml-2"
                      onClick={() => navigate(`/admin/articles/${articleId}`)}
                    >
                      <IoCaretForwardCircleSharp size={18} />
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>

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

export default ModifyImage;
