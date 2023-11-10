import DarkOverlay from "~/components/Layout/DarkOverlay";
import FormHeader from "~/components/Forms/Headers/FormHeader";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import BackSubmitButtons from "~/components/Forms/Buttons/BackSubmitButtons";
import { redirect, type ActionArgs, type LoaderArgs } from "@remix-run/node";
import {
  deleteArticleCategory,
  getArticleCategories,
  upsertArticleCategories,
} from "~/models/articleCategories.server";
import { useState } from "react";
import BasicInput from "~/components/Forms/Input/BasicInput";
import { validateForm } from "~/utility/validate";
import { tokenAuth } from "~/auth.server";
import { STAFF_SESSION_KEY } from "~/session.server";

export const loader = async ({ request, params }: LoaderArgs) => {
  const authenticated = await tokenAuth(request, STAFF_SESSION_KEY);
  if (!authenticated.valid) {
    return redirect("/login");
  }

  const id = params?.id;

  if (id === "add") {
    return null;
  } else {
    const articleCategory = (await getArticleCategories(id)) as ArticleCategory;
    return { articleCategory };
  }
};

export const action = async ({ request, params }: ActionArgs) => {
  const authenticated = await tokenAuth(request, STAFF_SESSION_KEY);
  if (!authenticated.valid) {
    return redirect("/login");
  }

  const id = params.id === "add" ? undefined : params.id;
  const form = Object.fromEntries(await request.formData());
  const { name } = form;

  switch (form._action) {
    case "upsert":
      const validate = {
        name: true,
      };

      const validationErrors = validateForm(form, validate);
      if (validationErrors) {
        return { validationErrors };
      }

      await upsertArticleCategories(name as string, id);
      return redirect("/admin/article-categories");

    case "delete":
      await deleteArticleCategory(id as string);
      return redirect("/admin/article-categories");
  }
};

const ModifyArticleCategory = () => {
  const { articleCategory } =
    (useLoaderData() as {
      articleCategory: ArticleCategory;
    }) || {};
  const { validationErrors } =
    (useActionData() as { validationErrors: ValidationErrors }) || {};
  const mode = articleCategory ? "edit" : "add";

  const [loading, setLoading] = useState<boolean>(false);

  return (
    <DarkOverlay>
      <Form
        method="POST"
        className="scrollbar-hide relative w-[500px] max-w-[100vw] overflow-y-auto bg-base-200 px-3 py-6 sm:px-6"
      >
        <FormHeader
          valueToChange={articleCategory}
          type="Category"
          mode={mode}
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
          validationErrors={validationErrors}
        />

        <BackSubmitButtons
          loading={loading}
          setLoading={setLoading}
          validationErrors={validationErrors}
        />
      </Form>
    </DarkOverlay>
  );
};

export default ModifyArticleCategory;
