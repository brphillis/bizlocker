import { type FormEvent, useEffect, useState } from "react";
import { getFormData } from "~/helpers/formHelpers";
import DarkOverlay from "~/components/Layout/DarkOverlay";
import BasicInput from "~/components/Forms/Input/BasicInput";
import FormHeader from "~/components/Forms/Headers/FormHeader";
import type { ActionReturnTypes } from "~/utility/actionTypes";
import { type ValidationErrors, validateForm } from "~/utility/validate";
import BackSubmitButtons from "~/components/Forms/Buttons/BackSubmitButtons";
import useNotification, {
  type PageNotification,
} from "~/hooks/PageNotification";
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
import {
  deleteArticleCategory,
  getArticleCategory,
  type ArticleCategoryWithDetails,
  upsertArticleCategory,
} from "~/models/articleCategories.server";

const validateOptions = {
  name: true,
};

export const articleCategoryUpsertLoader = async (
  request: Request,
  params: Params<string>
) => {
  let { searchParams } = new URL(request.url);
  let id = searchParams.get("contentId");

  if (!id) {
    throw new Response(null, {
      status: 404,
      statusText: "Article Not Found",
    });
  }

  const articleCategory =
    id === "add"
      ? ({} as ArticleCategoryWithDetails)
      : await getArticleCategory(id);

  if (!articleCategory) {
    throw new Response(null, {
      status: 404,
      statusText: "Article Not Found",
    });
  }

  return json({ articleCategory });
};

export const articleCategoryUpsertAction = async (
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

  const { name } = formEntries;

  switch (formEntries._action) {
    case "upsert":
      if (formErrors) {
        return { serverValidationErrors: formErrors };
      }

      await upsertArticleCategory(name as string, id);

      notification = {
        type: "success",
        message: `Category ${id === "add" ? "Added" : "Updated"}.`,
      };

      return { success: true, notification };

    case "delete":
      await deleteArticleCategory(id as string);

      notification = {
        type: "warning",
        message: "Brand Deleted",
      };

      return { success: true, notification };
  }
};

type Props = {
  asModule?: boolean;
};

const ArticleCategoryUpsert = ({ asModule }: Props) => {
  const { articleCategory } =
    useLoaderData<typeof articleCategoryUpsertLoader>();
  const { serverValidationErrors, success, notification } =
    (useActionData() as ActionReturnTypes) || {};

  const navigate = useNavigate();
  let submit = useSubmit();
  const [searchParams] = useSearchParams();
  const contentId = searchParams.get("contentId");
  useNotification(notification);

  const [clientValidationErrors, setClientValidationErrors] =
    useState<ValidationErrors>();
  const [loading, setLoading] = useState<boolean>(false);

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
        action: `/admin/upsert/articleCategory?contentId=${contentId}`,
        navigate: asModule ? false : true,
      });
    };

    submitFunction();

    if (asModule) {
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
      <Form
        method="POST"
        onSubmit={handleSubmit}
        className="scrollbar-hide relative w-[500px] max-w-[100vw] overflow-y-auto bg-base-200 px-3 py-6 sm:px-6"
      >
        <FormHeader
          valueToChange={articleCategory}
          type="Category"
          hasIsActive={true}
          hasDelete={true}
        />

        <BasicInput
          label="Name"
          name="name"
          type="text"
          placeholder="Name"
          customWidth="w-full"
          defaultValue={articleCategory?.name || undefined}
          validationErrors={serverValidationErrors || clientValidationErrors}
        />

        <BackSubmitButtons
          loading={loading}
          setLoading={setLoading}
          validationErrors={serverValidationErrors || clientValidationErrors}
        />
      </Form>
    </DarkOverlay>
  );
};

export default ArticleCategoryUpsert;
