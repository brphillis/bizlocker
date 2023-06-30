import {
  type ActionArgs,
  json,
  type LoaderArgs,
  redirect,
} from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import BackSubmitButtons from "~/components/Forms/Buttons/BackSubmitButtons";
import FormHeader from "~/components/Forms/Headers/FormHeader";
import SelectArticleCategories from "~/components/Forms/Select/SelectArticleCategories";
import ImageUploadSlider from "~/components/ImageUploadSlider.client";
import DarkOverlay from "~/components/Layout/DarkOverlay";
import RichTextEditor from "~/components/RichTextEditor.client";
import { getArticleCategories } from "~/models/articleCategories.server";
import {
  deleteArticle,
  getArticle,
  upsertArticle,
} from "~/models/articles.server";

export const loader = async ({ params }: LoaderArgs) => {
  const id = params?.id;

  if (id && id !== "add") {
    const article = await getArticle(id);
    const articleCategories = await getArticleCategories();
    return json({ article, articleCategories });
  } else return null;
};

export const action = async ({ request, params }: ActionArgs) => {
  const id = params.id === "add" ? undefined : params.id;
  const form = Object.fromEntries(await request.formData());

  switch (form._action) {
    case "upsert":
      const { title, articleCategories, content, images, isActive } = form;
      const articleData = {
        title: title.toString(),
        articleCategories: JSON.parse(articleCategories?.toString()),
        content: content.toString(),
        isActive: isActive ? true : false,
        images: images
          ? (JSON.parse(images?.toString()).filter(Boolean) as Image[])
          : undefined,
        id: id,
      };

      await upsertArticle(articleData);

      return redirect("/admin/articles");

    case "delete":
      await deleteArticle(id as string);
      return redirect("/admin/articles");
  }
};

const ModifyArticle = () => {
  const { article, articleCategories } =
    (useLoaderData() as {
      article: Article;
      articleCategories: ArticleCategory[];
    }) || {};
  const { statusText } = (useActionData() as { statusText: string }) || {};
  const mode = article ? "edit" : "add";

  const [currentImages, setCurrentImages] = useState<Image[] | undefined>(
    article?.images
  );

  const [richText, setRichText] = useState<string>(article?.content);

  return (
    <DarkOverlay>
      <Form
        method="POST"
        className="max-w-screen scrollbar-hide relative w-[800px] !max-w-[100vw] overflow-y-auto bg-base-300 px-3 py-6 sm:px-6"
      >
        <FormHeader
          valueToChange={article}
          type="Article"
          mode={mode}
          hasIsActive={true}
          hasDelete={true}
        />

        <div className="form-control">
          <div className="flex flex-row flex-wrap justify-around gap-3">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Title</span>
              </label>
              <input
                name="title"
                type="text"
                placeholder="Title"
                className="input-bordered input w-[95vw] sm:w-full"
                defaultValue={article?.title || undefined}
              />
            </div>

            <SelectArticleCategories
              articleCategories={articleCategories}
              valueToChange={article}
            />
          </div>

          <div className="form-control mt-3 w-[495px] max-w-[95vw] self-center">
            <label className="label">
              <span className="label-text">Content</span>
            </label>

            <RichTextEditor
              value={richText}
              onChange={setRichText}
              className="mb-6 h-[200px] pb-3"
            />

            <input
              hidden
              readOnly
              name="content"
              value={richText || article?.content}
            />
          </div>

          <ImageUploadSlider
            images={currentImages}
            onUpdateImages={setCurrentImages}
          />
          <input
            hidden
            readOnly
            name="images"
            value={JSON.stringify(currentImages) || ""}
          />

          {statusText && (
            <p className="my-2 text-center text-sm text-red-500/75">
              {statusText}
            </p>
          )}

          <BackSubmitButtons />
        </div>
      </Form>
    </DarkOverlay>
  );
};

export default ModifyArticle;
