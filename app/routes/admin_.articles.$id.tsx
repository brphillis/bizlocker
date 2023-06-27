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
import { useState } from "react";
import { IoMdTrash } from "react-icons/io";
import ImageUploadSlider from "~/components/ImageUploadSlider.client";
import RichTextEditor from "~/components/RichTextEditor.client";
import { getArticleCategories } from "~/models/articleCategories.server";
import {
  deleteArticle,
  getArticle,
  upsertArticle,
} from "~/models/articles.server";
import { capitalizeFirst } from "~/utility/stringHelpers";

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
      const { title, categories, content, images, isActive } = form;
      const articleData = {
        title: title.toString(),
        categories: JSON.parse(categories?.toString()),
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
  const navigate = useNavigate();
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
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    article?.categories.map((e) => e?.name) || [""]
  );

  const [isActive, setisActive] = useState<string | undefined>(
    mode === "add" ? " " : article?.isActive ? " " : ""
  );
  const [richText, setRichText] = useState<string>(article?.content);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(
      e.target.selectedOptions,
      (option: HTMLOptionElement) => option.value
    );
    setSelectedCategories(selectedOptions);
  };

  return (
    <div
      className="
      absolute inset-0 flex h-max min-h-[100vh] w-[100vw] flex-col items-center justify-center bg-black/80 py-3"
    >
      <Form
        method="POST"
        className="
          relative w-[600px] max-w-[99vw] rounded-lg border-t-4 border-primary bg-base-300 p-6"
      >
        <Form method="POST" className="flex flex-row justify-between">
          <h1>{mode && capitalizeFirst(mode)} Article</h1>

          <label className="label absolute right-16 top-[1.1rem] cursor-pointer">
            <input
              type="checkbox"
              className="toggle-success toggle ml-3"
              checked={isActive ? true : false}
              onChange={(e) =>
                setisActive(e.target.checked ? "true" : undefined)
              }
            />
            <span className="label-text ml-3">Active</span>
            <input name="isActive" value={isActive || ""} readOnly hidden />
          </label>

          <button
            type="submit"
            name="_action"
            value="delete"
            className="relative w-max rounded-full bg-red-500 p-1 text-white"
          >
            <IoMdTrash size={18} />
          </button>
        </Form>
        <input name="isActive" value={isActive || ""} readOnly hidden />

        <div className="divider w-full" />

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

            <div className="form-control">
              <label className="label">
                <span className="label-text">Category</span>
              </label>
              <select
                className="select-bordered select w-[95vw] sm:w-[215px]"
                onChange={handleCategoryChange}
                value={selectedCategories}
                multiple
              >
                <option disabled value="">
                  Select a Category
                </option>
                {articleCategories?.map(({ id, name }: ArticleCategory) => {
                  return (
                    <option key={id} value={name}>
                      {name}
                    </option>
                  );
                })}
              </select>
              <input
                hidden
                readOnly
                name="categories"
                value={JSON.stringify(selectedCategories) || ""}
              />
            </div>
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

          <div className="flex flex-row justify-center gap-6">
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

export default ModifyArticle;
