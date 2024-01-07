import type { Campaign, Image, Promotion } from "@prisma/client";
import type { ActionReturnTypes } from "~/utility/actionTypes";
import { type FormEvent, useEffect, useState } from "react";
import { type ValidationErrors, validateForm } from "~/utility/validate";
import DarkOverlay from "~/components/Layout/Overlays/DarkOverlay";
import { IoCaretForwardCircleSharp } from "react-icons/io5";
import BasicInput from "~/components/Forms/Input/BasicInput";
import UploadImage from "~/components/Forms/Upload/UploadImage";
import {
  type ImageWithDetails,
  deleteImage,
  getImage,
  upsertImage,
} from "~/models/images.server";
import BackSubmitButtons from "~/components/Forms/Buttons/BackSubmitButtons";
import { json } from "@remix-run/node";
import {
  Form,
  type Params,
  useActionData,
  useLoaderData,
  useNavigate,
  useSubmit,
  useSearchParams,
} from "@remix-run/react";
import useNotification, {
  type PageNotification,
} from "~/hooks/PageNotification";
import { getFormData } from "~/helpers/formHelpers";
import { ActionAlert } from "~/components/Notifications/Alerts";
import { hasNonEmptyArrayObjectOrIdKey } from "~/helpers/contentHelpers";
import WindowContainer from "~/components/Layout/Containers/WindowContainer";

const validateOptions = {
  image: true,
  altText: true,
};

export const imageUpsertLoader = async (
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

  const image = id === "add" ? ({} as ImageWithDetails) : await getImage(id);

  if (!image) {
    throw new Response(null, {
      status: 404,
      statusText: "Image Not Found",
    });
  }

  return json({ image });
};

export const imageUpsertAction = async (
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

  const { image, altText } = formEntries;

  switch (formEntries._action) {
    case "upsert":
      if (formErrors) {
        return json({ serverValidationErrors: formErrors });
      }

      const parsedImage = image
        ? (JSON.parse(image?.toString()) as Image)
        : undefined;

      parsedImage && (await upsertImage(altText as string, parsedImage, id));

      notification = {
        type: "success",
        message: `Image ${id === "add" ? "Added" : "Updated"}.`,
      };

      return json({ success: true, notification });

    case "delete":
      await deleteImage(id as string);

      notification = {
        type: "warning",
        message: "Image Deleted",
      };

      return json({ success: true, notification });
  }
};

type Props = {
  offRouteModule?: boolean;
};

const ImageUpsert = ({ offRouteModule }: Props) => {
  const { image } = useLoaderData<typeof imageUpsertLoader>() || {};
  const { serverValidationErrors, success, notification } =
    (useActionData() as ActionReturnTypes) || {};

  const navigate = useNavigate();
  let submit = useSubmit();
  const [searchParams] = useSearchParams();
  const contentId = searchParams.get("contentId");
  useNotification(notification);

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
  } = image || {};

  const [clientValidationErrors, setClientValidationErrors] =
    useState<ValidationErrors>();
  const [loading, setLoading] = useState<boolean>(false);
  const [hasConnection] = useState<boolean>(
    hasNonEmptyArrayObjectOrIdKey(image)
  );

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
        action: `/admin/upsert/image?contentId=${contentId}`,
        navigate: offRouteModule ? false : true,
      });
    };

    if (hasConnection) {
      ActionAlert(
        "Resource Has Connections",
        "Update this resource?",
        () => submitFunction(),
        () => setLoading(false),
        "warning"
      );
    } else {
      submitFunction();
    }

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
        hasMode={true}
        title="Image"
        children={
          <Form
            method="POST"
            onSubmit={handleSubmit}
            className="scrollbar-hide relative w-[500px] max-w-full overflow-y-auto"
          >
            <div className="form-control w-full items-center gap-3">
              <UploadImage defaultValue={image} />

              <BasicInput
                label="Title"
                name="altText"
                placeholder="Title"
                customWidth="w-full"
                defaultValue={altText || undefined}
                type="text"
                validationErrors={
                  serverValidationErrors || clientValidationErrors
                }
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
                                onClick={() =>
                                  navigate(`/admin/promotions/${id}`)
                                }
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
                                onClick={() =>
                                  navigate(`/admin/promotions/${id}`)
                                }
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
                                onClick={() =>
                                  navigate(`/admin/campaigns/${id}`)
                                }
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
                                onClick={() =>
                                  navigate(`/admin/campaigns/${id}`)
                                }
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
                          onClick={() =>
                            navigate(`/admin/products/${productId}`)
                          }
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
                          onClick={() =>
                            navigate(`/admin/articles/${articleId}`)
                          }
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

export default ImageUpsert;
