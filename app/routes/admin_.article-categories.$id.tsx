import {
  type ActionArgs,
  json,
  type LoaderArgs,
  redirect,
} from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigate,
} from "@remix-run/react";
import { IoMdTrash } from "react-icons/io";
import { tokenAuth } from "~/auth.server";
import {
  deleteArticleCategory,
  getArticleCategories,
  upsertArticleCategories,
} from "~/models/articleCategories.server";
import { capitalizeFirst } from "~/utility/stringHelpers";

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
  const navigate = useNavigate();
  const { articleCategory } =
    (useLoaderData() as {
      articleCategory: ArticleCategory;
    }) || {};
  const { validationError } =
    (useActionData() as { validationError: string }) || {};
  const mode = articleCategory ? "edit" : "add";

  return (
    <div className="absolute inset-0 flex h-[100vh] w-[100vw] flex-col items-center justify-center bg-black/80">
      <Form
        method="POST"
        className="relative max-h-[calc(100vh-64px)] max-w-[99vw] rounded-lg border-t-4 border-primary bg-base-300 p-6"
      >
        <div className="flex flex-row justify-between">
          <h1>{mode && capitalizeFirst(mode)} Category</h1>
        </div>

        <div className="divider w-full" />

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

          <div className="flex flex-row justify-around">
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
        </div>
      </Form>
    </div>
  );
};

export default ModifyArticleCategory;
