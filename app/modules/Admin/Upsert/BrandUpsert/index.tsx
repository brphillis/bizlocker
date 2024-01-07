import { type FormEvent, useEffect, useState } from "react";
import { json } from "@remix-run/node";
import { getFormData } from "~/helpers/formHelpers";
import DarkOverlay from "~/components/Layout/Overlays/DarkOverlay";
import BasicInput from "~/components/Forms/Input/BasicInput";
import type { ActionReturnTypes } from "~/utility/actionTypes";
import UploadImage from "~/components/Forms/Upload/UploadImage";
import type { Image } from "~/models/images.server";
import { type ValidationErrors, validateForm } from "~/utility/validate";
import BackSubmitButtons from "~/components/Forms/Buttons/BackSubmitButtons";
import useNotification, {
  type PageNotification,
} from "~/hooks/PageNotification";
import {
  deleteBrand,
  getBrand,
  type BrandWithContent,
  upsertBrand,
  type NewBrand,
} from "~/models/brands.server";
import {
  Form,
  type Params,
  useActionData,
  useLoaderData,
  useNavigate,
  useSubmit,
  useSearchParams,
  useParams,
} from "@remix-run/react";
import WindowContainer, {
  handleWindowedFormData,
} from "~/components/Layout/Containers/WindowContainer";

const validateOptions = {
  name: true,
};

export const brandUpsertLoader = async (
  request: Request,
  params: Params<string>
) => {
  let { searchParams } = new URL(request.url);
  let id = searchParams.get("contentId");

  if (!id) {
    throw new Response(null, {
      status: 404,
      statusText: "Brand Not Found",
    });
  }

  const brand = id === "add" ? ({} as BrandWithContent) : await getBrand(id);

  if (!brand) {
    throw new Response(null, {
      status: 404,
      statusText: "Brand Not Found",
    });
  }

  return json({ brand });
};

export const brandUpsertAction = async (
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

  const { name, image, isActive } = formEntries;

  switch (formEntries._action) {
    case "upsert":
      if (formErrors) {
        return { serverValidationErrors: formErrors };
      }

      const updateData: NewBrand = {
        id: (id as string) || undefined,
        name: name as string,
        image: image ? (JSON.parse(image?.toString()) as Image) : undefined,
        isActive: id ? (isActive ? true : false) : false,
      };

      await upsertBrand(updateData);

      notification = {
        type: "success",
        message: `Brand ${id === "add" ? "Added" : "Updated"}.`,
      };

      return { success: true, notification };

    case "delete":
      await deleteBrand(id as string);

      notification = {
        type: "warning",
        message: "Brand Deleted",
      };

      return { success: true, notification };
  }
};

type Props = {
  offRouteModule?: boolean;
};

const BrandUpsert = ({ offRouteModule }: Props) => {
  const { brand } = useLoaderData<typeof brandUpsertLoader>();
  const { serverValidationErrors, success, notification } =
    (useActionData() as ActionReturnTypes) || {};

  const navigate = useNavigate();
  let submit = useSubmit();
  const [searchParams] = useSearchParams();
  const contentId = searchParams.get("contentId");
  const { contentType } = useParams();
  useNotification(notification);

  const [clientValidationErrors, setClientValidationErrors] =
    useState<ValidationErrors>();
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    let form = getFormData(event);
    event.preventDefault();

    form = handleWindowedFormData(form);

    const { formErrors } = validateForm(new FormData(form), validateOptions);
    if (formErrors) {
      setClientValidationErrors(formErrors);
      setLoading(false);
      return;
    }

    submit(form, {
      method: "POST",
      action: `/admin/upsert/${contentType}?contentId=${contentId}`,
      navigate: offRouteModule ? false : true,
    });

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
        hasIsActive={true}
        hasMode={true}
        isActive={brand?.isActive}
        title="Brand"
        children={
          <Form
            method="POST"
            onSubmit={handleSubmit}
            className="scrollbar-hide relative w-[500px] max-w-full overflow-y-auto"
          >
            <div className="flex flex-col gap-6">
              <BasicInput
                name="name"
                label="Name"
                placeholder="Name"
                type="text"
                customWidth="w-full"
                defaultValue={brand?.name || undefined}
                validationErrors={
                  serverValidationErrors || clientValidationErrors
                }
              />

              <UploadImage defaultValue={brand?.image} />
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

export default BrandUpsert;
