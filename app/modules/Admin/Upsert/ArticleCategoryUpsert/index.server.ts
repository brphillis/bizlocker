import { json } from "@remix-run/node";
import type { Params } from "@remix-run/react";
import { validateForm } from "~/utility/validate";
import type { PageNotification } from "~/hooks/PageNotification";
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
  params: Params<string>,
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
  params: Params<string>,
) => {
  let notification: PageNotification;

  let { searchParams } = new URL(request.url);
  const contentId = searchParams.get("contentId");
  let id = contentId === "add" || !contentId ? undefined : contentId;

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
