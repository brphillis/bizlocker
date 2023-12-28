import { tokenAuth } from "~/auth.server";
import type { ActionReturnTypes } from "~/utility/actionTypes";
import DarkOverlay from "~/components/Layout/DarkOverlay";
import FormHeader from "~/components/Forms/Headers/FormHeader";
import UploadImage from "~/components/Forms/Upload/UploadImage";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigate,
} from "@remix-run/react";
import {
  type BrandWithContent,
  deleteBrand,
  getBrand,
  upsertBrand,
} from "~/models/brands.server";
import BackSubmitButtons from "~/components/Forms/Buttons/BackSubmitButtons";
import {
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  json,
} from "@remix-run/node";
import { useEffect, useState } from "react";
import BasicInput from "~/components/Forms/Input/BasicInput";
import { validateForm } from "~/utility/validate";
import { STAFF_SESSION_KEY } from "~/session.server";
import type { ImageWithDetails } from "~/models/images.server";
import useNotification, {
  type PageNotification,
} from "~/hooks/PageNotification";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const authenticated = await tokenAuth(request, STAFF_SESSION_KEY);

  if (!authenticated.valid) {
    return redirect("/login");
  }

  const id = params?.id;

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

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const authenticated = await tokenAuth(request, STAFF_SESSION_KEY);
  if (!authenticated.valid) {
    return redirect("/login");
  }
  const id = params.id === "add" ? undefined : params.id;
  const form = Object.fromEntries(await request.formData());
  const { name, image } = form;

  let notification: PageNotification;

  switch (form._action) {
    case "upsert":
      const validate = {
        name: true,
        image: true,
      };

      const validationErrors = validateForm(form, validate);
      if (validationErrors) {
        return { validationErrors };
      }

      const parsedImage = image
        ? (JSON.parse(image?.toString()) as ImageWithDetails)
        : undefined;

      await upsertBrand(name as string, parsedImage, id);

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

const ModifyBrand = () => {
  const { brand } = useLoaderData<typeof loader>();
  const { validationErrors, success, notification } =
    (useActionData() as ActionReturnTypes) || {};

  const navigate = useNavigate();
  useNotification(notification);

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
      >
        <FormHeader
          valueToChange={brand}
          type="Brand"
          hasIsActive={true}
          hasDelete={true}
        />
        <div className="flex flex-col gap-6">
          <BasicInput
            name="name"
            label="Name"
            placeholder="Name"
            type="text"
            customWidth="w-full"
            defaultValue={brand?.name || undefined}
            validationErrors={validationErrors}
          />

          <UploadImage defaultValue={brand?.image} />
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

export default ModifyBrand;
