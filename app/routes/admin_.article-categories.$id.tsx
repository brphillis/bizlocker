import DarkOverlay from "~/components/Layout/DarkOverlay";
import FormHeader from "~/components/Forms/Headers/FormHeader";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import BackSubmitButtons from "~/components/Forms/Buttons/BackSubmitButtons";
import {
  json,
  redirect,
  type ActionArgs,
  type LoaderArgs,
} from "@remix-run/node";
import {
  deleteArticleCategory,
  getArticleCategories,
  upsertArticleCategories,
} from "~/models/articleCategories.server";

export const loader = async ({ params }: LoaderArgs) => {
  const id = params?.id;

  if (id === "add") {
    return null;
  } else {
    const articleCategory = (await getArticleCategories(id)) as ArticleCategory;
    return json({ articleCategory });
  }
};

export const action = async ({ request, params }: ActionArgs) => {
  const id = params.id === "add" ? undefined : params.id;
  const form = Object.fromEntries(await request.formData());
  const { name } = form;

  switch (form._action) {
    case "upsert":
      if (!name || name.length < 3) {
        const validationError = "name must be at least 3 chars.";
        return { validationError };
      }

      if (!name || name.length < 3) {
        const validationError = "name must be at least 3 chars.";
        return { validationError };
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
  const { validationError } =
    (useActionData() as { validationError: string }) || {};
  const mode = articleCategory ? "edit" : "add";

  return (
    <DarkOverlay>
      <Form
        method="POST"
        className="relative max-w-full rounded-none bg-base-200 px-0 py-6 sm:rounded-md sm:px-6"
      >
        <FormHeader
          valueToChange={articleCategory}
          type="Category"
          mode={mode}
          hasIsActive={true}
          hasDelete={true}
        />

        <div className="form-control mt-6 w-full max-w-xs">
          <input
            name="name"
            type="text"
            placeholder="Name"
            className="input-bordered input w-full max-w-xs"
            defaultValue={articleCategory?.name || undefined}
          />

          {validationError && (
            <p className="h-0 py-3 text-center text-sm text-red-500/75">
              {validationError}
            </p>
          )}

          <BackSubmitButtons />
        </div>
      </Form>
    </DarkOverlay>
  );
};

export default ModifyArticleCategory;
