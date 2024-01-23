import { json } from "@remix-run/node";
import { validateForm } from "~/utility/validate";
import { PageNotification } from "~/hooks/PageNotification";
import {
  deleteArticleCategory,
  getArticleCategory,
  upsertArticleCategory,
} from "~/models/ArticleCategories/index.server";
import { ArticleCategoryWithDetails } from "~/models/ArticleCategories/types";
const validateOptions = {
  name: true,
};

export const articleCategoryUpsertLoader = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("contentId");

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

export const articleCategoryUpsertAction = async (request: Request) => {
  let notification: PageNotification;

  const { searchParams } = new URL(request.url);
  const contentId = searchParams.get("contentId");
  const id = contentId === "add" || !contentId ? undefined : contentId;

  const { formEntries, formErrors } = validateForm(
    await request.formData(),
    validateOptions,
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
