import type { Campaign, Promotion } from "@prisma/client";
import type { ActionReturnTypes } from "~/utility/actionTypes";
import { type FormEvent, useEffect, useState } from "react";
import { type ValidationErrors, validateForm } from "~/utility/validate";
import DarkOverlay from "~/components/Layout/Overlays/DarkOverlay";
import { IoCaretForwardCircleSharp, IoTrashSharp } from "react-icons/io5";
import BasicInput from "~/components/Forms/Input/BasicInput";
import UploadImage from "~/components/Forms/Upload/UploadImage";
import BackSubmitButtons from "~/components/Forms/Buttons/BackSubmitButtons";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigate,
  useSubmit,
  useSearchParams,
} from "@remix-run/react";
import useNotification from "~/hooks/PageNotification";
import { getFormData } from "~/helpers/formHelpers";
import { ActionAlert } from "~/components/Notifications/Alerts";
import { hasNonEmptyArrayObjectOrIdKey } from "~/helpers/contentHelpers";
import WindowContainer from "~/components/Layout/Containers/WindowContainer";
import type { imageUpsertLoader } from "./index.server";

const validateOptions = {
  image: true,
  altText: true,
};

type Props = {
  offRouteModule?: boolean;
};

const ImageUpsert = ({ offRouteModule }: Props) => {
  const { image } = useLoaderData<typeof imageUpsertLoader>() || {};
  const { serverValidationErrors, success, notification } =
    (useActionData() as ActionReturnTypes) || {};

  const navigate = useNavigate();
  const submit = useSubmit();
  const [searchParams] = useSearchParams();
  const contentId = searchParams.get("contentId");
  useNotification(notification);

  const {
    altText,
    promotionBanner,
    promotionTile,
    campaignBanner,
    campaignTile,
    brandHeroImageId,
    productSubCategoryTileImageId,
    articleId,
    productId,
  } = image || {};

  const [clientValidationErrors, setClientValidationErrors] =
    useState<ValidationErrors>();
  const [loading, setLoading] = useState<boolean>(false);
  const [hasConnection] = useState<boolean>(
    hasNonEmptyArrayObjectOrIdKey(image),
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = getFormData(event);

    const submitFunction = () => {
      submit(form, {
        method: "POST",
        action: `/admin/upsert/image?contentId=${contentId}`,
        navigate: offRouteModule ? false : true,
      });

      if (offRouteModule) {
        navigate(-1);
      }
    };

    const { formErrors, formEntries } = validateForm(
      new FormData(form),
      validateOptions,
    );

    if (formErrors) {
      setClientValidationErrors(formErrors);
      setLoading(false);
      return;
    }

    if (formEntries._action === "delete") {
      ActionAlert(
        "Warning",
        "Delete this Image?",
        () => {
          submitFunction();
          if (offRouteModule) {
            navigate(-1);
          }
        },
        () => {
          setLoading(false);
          return;
        },
        "warning",
      );
    } else {
      if (hasConnection) {
        ActionAlert(
          "Resource Has Connections",
          "Update this resource?",
          () => submitFunction(),
          () => setLoading(false),
          "warning",
        );
      } else {
        submitFunction();
      }
    }
  };

  useEffect(() => {
    if (success) {
      navigate(-1);
    }
  }, [success, navigate]);

  return (
    <DarkOverlay>
      <WindowContainer hasMode={true} title="Image">
        <Form
          method="POST"
          onSubmit={handleSubmit}
          className="scrollbar-hide relative w-[500px] max-w-full overflow-y-auto"
        >
          <button
            type="submit"
            name="_action"
            value="delete"
            className="absolute z-50 top-0 right-0 text-white bg-error rounded-full p-1 text-sm"
          >
            <IoTrashSharp />
          </button>

          <div className="form-control w-full items-center gap-3">
            <UploadImage defaultValue={image} />

            <BasicInput
              label="Title"
              name="altText"
              placeholder="Title"
              extendContainerStyle="w-full"
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
                            <button
                              type="button"
                              className="ml-2"
                              onClick={() =>
                                navigate(`/admin/promotions/${id}`)
                              }
                            >
                              <IoCaretForwardCircleSharp size={18} />
                            </button>
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
                            <button
                              type="button"
                              className="ml-2"
                              onClick={() =>
                                navigate(`/admin/promotions/${id}`)
                              }
                            >
                              <IoCaretForwardCircleSharp size={18} />
                            </button>
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
                            <button
                              type="button"
                              className="ml-2"
                              onClick={() => navigate(`/admin/campaigns/${id}`)}
                            >
                              <IoCaretForwardCircleSharp size={18} />
                            </button>
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
                            <button
                              type="button"
                              className="ml-2"
                              onClick={() => navigate(`/admin/campaigns/${id}`)}
                            >
                              <IoCaretForwardCircleSharp size={18} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </>
                )}
                {brandHeroImageId && (
                  <tr className="hover cursor-pointer">
                    <td className="w-4/5">Brand Image</td>
                    <td className="w-1/5">
                      <button
                        type="button"
                        className="ml-2"
                        onClick={() =>
                          navigate(`/admin/brands/${brandHeroImageId}`)
                        }
                      >
                        <IoCaretForwardCircleSharp size={18} />
                      </button>
                    </td>
                  </tr>
                )}
                {productSubCategoryTileImageId && (
                  <tr className="hover cursor-pointer">
                    <td className="w-4/5">Product Category Image</td>
                    <td className="w-1/5">
                      <button
                        type="button"
                        className="ml-2"
                        onClick={() =>
                          navigate(
                            `/admin/product-categories/${productSubCategoryTileImageId}`,
                          )
                        }
                      >
                        <IoCaretForwardCircleSharp size={18} />
                      </button>
                    </td>
                  </tr>
                )}
                {productId && (
                  <tr className="hover cursor-pointer">
                    <td className="w-4/5">Product Image</td>
                    <td className="w-1/5">
                      <button
                        type="button"
                        className="ml-2"
                        onClick={() => navigate(`/admin/products/${productId}`)}
                      >
                        <IoCaretForwardCircleSharp size={18} />
                      </button>
                    </td>
                  </tr>
                )}
                {articleId && (
                  <tr className="hover cursor-pointer">
                    <td className="w-4/5">Article Image</td>
                    <td className="w-1/5">
                      <button
                        type="button"
                        className="ml-2"
                        onClick={() => navigate(`/admin/articles/${articleId}`)}
                      >
                        <IoCaretForwardCircleSharp size={18} />
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <BackSubmitButtons
            loading={loading}
            setLoading={setLoading}
            validationErrors={serverValidationErrors || clientValidationErrors}
          />
        </Form>
      </WindowContainer>
    </DarkOverlay>
  );
};

export default ImageUpsert;
