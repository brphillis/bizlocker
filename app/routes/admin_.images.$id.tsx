import type { Campaign, Image, Promotion } from "@prisma/client";
import { useEffect, useState } from "react";
import { tokenAuth } from "~/auth.server";
import { validateForm } from "~/utility/validate";
import { STAFF_SESSION_KEY } from "~/session.server";
import DarkOverlay from "~/components/Layout/DarkOverlay";
import { IoCaretForwardCircleSharp } from "react-icons/io5";
import { handleResourceSubmit } from "~/helpers/formHelpers";
import BasicInput from "~/components/Forms/Input/BasicInput";
import FormHeader from "~/components/Forms/Headers/FormHeader";
import UploadImage from "~/components/Forms/Upload/UploadImage";
import { deleteImage, getImage, upsertImage } from "~/models/images.server";
import BackSubmitButtons from "~/components/Forms/Buttons/BackSubmitButtons";
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
  useSubmit,
} from "@remix-run/react";

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

  let image = null;

  if (id !== "add") {
    image = await getImage(id);
  }

  if (!image) {
    throw new Response(null, {
      status: 404,
      statusText: "Image Not Found",
    });
  }

  return json({ image });
};

export const action = async ({ request, params }: ActionArgs) => {
  const authenticated = await tokenAuth(request, STAFF_SESSION_KEY);

  if (!authenticated.valid) {
    return redirect("/login");
  }

  const id = params.id === "add" ? undefined : params.id;
  const form = Object.fromEntries(await request.formData());

  const { image, altText } = form;

  switch (form._action) {
    case "upsert":
      const validate = {
        image: true,
        altText: true,
      };

      const validationErrors = validateForm(form, validate);
      if (validationErrors) {
        return json({ validationErrors });
      }

      const parsedImage = image
        ? (JSON.parse(image?.toString()) as Image)
        : undefined;

      parsedImage && (await upsertImage(altText as string, parsedImage, id));

      return json({ success: true });

    case "delete":
      await deleteImage(id as string);
      return json({ success: true });
  }
};

const ModifyImage = () => {
  const { image } = useLoaderData<typeof loader>();
  const { validationErrors, success } = useActionData() as ActionReturnTypes;

  const navigate = useNavigate();
  let submit = useSubmit();

  const {
    altText,
    promotionBanner,
    promotionTile,
    campaignBanner,
    campaignTile,
    brandId,
    productSubCategoryId,
    articleId,
    productId,
  } = image;

  const determineIfConnected = (): boolean => {
    if (
      promotionBanner ||
      promotionTile ||
      campaignBanner ||
      campaignTile ||
      brandId ||
      productSubCategoryId ||
      articleId ||
      productId
    ) {
      return true;
    } else return false;
  };

  const isConnected = determineIfConnected();

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
        className="scrollbar-hide relative w-[500px] max-w-[100vw] overflow-y-auto bg-base-200 px-3 py-6 sm:px-6"
        onSubmit={(e) => handleResourceSubmit(e, submit, isConnected)}
      >
        <FormHeader
          valueToChange={image}
          type="Image"
          hasIsActive={false}
          hasDelete={true}
        />

        <div className="form-control w-full items-center gap-3">
          <UploadImage defaultValue={image} />

          <BasicInput
            label="Title"
            name="altText"
            placeholder="Title"
            customWidth="w-full"
            defaultValue={altText || undefined}
            type="text"
            validationErrors={validationErrors}
          />

          <div className="mt-6 text-sm">Existing Connections</div>

          <table className="table table-zebra table-sm">
            <thead>
              <tr>
                <th className="w-4/5">Type</th>
                <th className="w-1/5">Go To</th>
              </tr>
            </thead>
            <tbody>
              {promotionBanner && promotionBanner?.length > 0 && (
                <>
                  {promotionBanner.map(({ id }: Promotion) => {
                    return (
                      <tr
                        key={"promotionBanner_" + id}
                        className="hover cursor-pointer"
                      >
                        <td className="w-4/5">Promotion Banner</td>
                        <td className="w-1/5">
                          <div
                            className="ml-2"
                            onClick={() => navigate(`/admin/promotions/${id}`)}
                          >
                            <IoCaretForwardCircleSharp size={18} />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </>
              )}
              {promotionTile && promotionTile?.length > 0 && (
                <>
                  {promotionTile.map(({ id }: Promotion) => {
                    return (
                      <tr
                        key={"promotionTile_" + id}
                        className="hover cursor-pointer"
                      >
                        <td className="w-4/5">Promotion Tile</td>
                        <td className="w-1/5">
                          <div
                            className="ml-2"
                            onClick={() => navigate(`/admin/promotions/${id}`)}
                          >
                            <IoCaretForwardCircleSharp size={18} />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </>
              )}
              {campaignBanner && campaignBanner?.length > 0 && (
                <>
                  {campaignBanner.map(({ id }: Campaign) => {
                    return (
                      <tr
                        key={"campaignBanner" + id}
                        className="hover cursor-pointer"
                      >
                        <td className="w-4/5">Campaign Banner</td>
                        <td className="w-1/5">
                          <div
                            className="ml-2"
                            onClick={() => navigate(`/admin/campaigns/${id}`)}
                          >
                            <IoCaretForwardCircleSharp size={18} />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </>
              )}
              {campaignTile && campaignTile?.length > 0 && (
                <>
                  {campaignTile.map(({ id }: Campaign) => {
                    return (
                      <tr
                        key={"campaignTile" + id}
                        className="hover cursor-pointer"
                      >
                        <td className="w-4/5">Campaign Tile</td>
                        <td className="w-1/5">
                          <div
                            className="ml-2"
                            onClick={() => navigate(`/admin/campaigns/${id}`)}
                          >
                            <IoCaretForwardCircleSharp size={18} />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </>
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
              {productSubCategoryId && (
                <tr className="hover cursor-pointer">
                  <td className="w-4/5">Product Category Image</td>
                  <td className="w-1/5">
                    <div
                      className="ml-2"
                      onClick={() =>
                        navigate(
                          `/admin/product-categories/${productSubCategoryId}`
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

export default ModifyImage;
