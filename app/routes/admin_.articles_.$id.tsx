import {
  type ActionArgs,
  type LoaderArgs,
  type LinksFunction,
  redirect,
} from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useSubmit,
} from "@remix-run/react";

import { getArticleCategories } from "~/models/articleCategories.server";
import {
  deleteArticle,
  getArticle,
  upsertArticleInfo,
} from "~/models/articles.server";

import swiper from "../../node_modules/swiper/swiper.css";
import swiperNav from "../../node_modules/swiper/modules/navigation/navigation.min.css";
import AdminPageWrapper from "~/components/Layout/_Admin/AdminPageWrapper";
import AdminPageHeader from "~/components/Layout/_Admin/AdminPageHeader";
import Icon from "~/components/Icon";
import PageBuilder from "~/components/PageBuilder";
import {
  changeBlockOrder,
  removeBlock,
  updatePageBlock,
} from "~/models/pageBuilder.server";
import UploadImage from "~/components/Forms/Upload/UploadImage";
import SelectArticleCategories from "~/components/Forms/Select/SelectArticleCategories";
import LargeCollapse from "~/components/Collapse/LargeCollapse";
import { getProductCategories } from "~/models/productCategories.server";
import { getProductSubCategories } from "~/models/productSubCategories.server";
import { getBrands } from "~/models/brands.server";
import {
  getFormBlockOptions,
  getBlockUpdateValues,
  searchContentData,
} from "~/utility/pageBuilder";
import { HiTrash } from "react-icons/hi2";
import { useState } from "react";
import { getAvailableColors } from "~/models/enums.server";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: swiper },
  { rel: "stylesheet", href: swiperNav },
];

export const loader = async ({ params }: LoaderArgs) => {
  const id = params?.id;

  const articleCategories = await getArticleCategories();
  const productCategories = await getProductCategories();
  const productSubCategories = await getProductSubCategories();
  const brands = await getBrands();
  const colors = await getAvailableColors();

  if (id && id !== "add") {
    const article = await getArticle(id);
    return {
      article,
      articleCategories,
      productCategories,
      productSubCategories,
      brands,
      colors,
    };
  } else return { articleCategories };
};

export const action = async ({ request, params }: ActionArgs) => {
  const id = params.id === "add" ? undefined : params.id;
  const form = Object.fromEntries(await request.formData());
  const {
    title,
    description,
    isActive,
    articleCategories,
    thumbnail,
    itemIndex,
    contentType,
    name,
  } = form;

  const blockOptions: NewBlockOptions = getFormBlockOptions(form);

  switch (form._action) {
    case "search":
      return await searchContentData(
        contentType as BlockContentType,
        (name as string) || undefined
      );

    case "updateMeta":
      let metaValidationError: string[] = [];

      if (!title) {
        metaValidationError.push("Title is Required");
      }

      if (!description) {
        metaValidationError.push("Description is Required");
      }

      if (!articleCategories) {
        metaValidationError.push("Category is Required");
      }

      if (metaValidationError.length > 0) {
        return { metaValidationError };
      }

      //we create a new article if ID is not provided
      const articleId = await upsertArticleInfo(
        title as string,
        description as string,
        isActive as string,
        JSON.parse(articleCategories as string),
        JSON.parse(thumbnail as string),
        id ? parseInt(id) : undefined
      );

      if (params.id === "add") {
        return redirect(`/admin/articles/${articleId}`);
      } else return null;

    case "update":
      const newBlockData: NewBlockData = getBlockUpdateValues(form);

      let blockValidationError: string[] = [];

      if (newBlockData.contentType && !newBlockData.contentData) {
        blockValidationError.push("Content Selection is Required.");
      }

      if (blockValidationError.length > 0) {
        return { blockValidationError };
      }

      const updateSuccess = await updatePageBlock(
        "article",
        parseInt(id as string),
        newBlockData,
        blockOptions
      );

      return { updateSuccess };

    case "rearrange":
      const { direction } = form;

      return await changeBlockOrder(
        "article",
        parseInt(id as string),
        parseInt(itemIndex as string),
        direction as "up" | "down"
      );

    case "delete":
      return await removeBlock(
        parseInt(id as string),
        parseInt(itemIndex as string),
        "article"
      );

    case "deleteArticle":
      return await deleteArticle(parseInt(id as string));
  }
};

const ModifyArticle = () => {
  const submit = useSubmit();
  const {
    article,
    productCategories,
    articleCategories,
    productSubCategories,
    brands,
    colors,
  } = useLoaderData() || {};

  const {
    searchResults,
    updateSuccess,
    metaValidationError,
    blockValidationError,
  } = useActionData() || {};

  const [isActive, setIsActive] = useState<string | undefined>(
    article?.isActive ? " " : ""
  );

  return (
    <AdminPageWrapper>
      <div className="relative h-full w-full bg-base-200 p-6 sm:w-full">
        <div className="hidden sm:block">
          <AdminPageHeader
            title={article ? "Edit Article" : "Create Article"}
          />
        </div>

        <div className="flex w-full justify-center">
          <div className="flex flex-col gap-6">
            <div className="relative flex justify-center gap-3 text-center text-2xl font-bold">
              <Icon iconName="IoNewspaper" size={24} styles="mt-[5px]" />
              {article ? article.title : "Create Article"}

              <HiTrash
                size={24}
                className="bg-brand-lightest text-brand-lightest/50 absolute right-3 top-2 cursor-pointer rounded-full bg-error p-[0.3rem] text-brand-white"
                onClick={() => {
                  const formData = new FormData();
                  formData.set("_action", "deleteArticle");
                  submit(formData, { method: "POST" });
                }}
              />
            </div>

            <LargeCollapse
              title="Meta Information"
              forceOpen={!article}
              content={
                <Form
                  method="POST"
                  className="flex w-full flex-col items-center gap-6"
                >
                  <>
                    <label className="label absolute right-[8%] top-[1.8rem] z-10 mt-0 h-1 cursor-pointer sm:mt-1">
                      <input
                        type="checkbox"
                        className="toggle toggle-sm ml-3"
                        checked={isActive ? true : false}
                        onChange={(e) =>
                          setIsActive(e.target.checked ? "true" : undefined)
                        }
                      />
                      <span className="label-text ml-3 text-brand-white">
                        Active
                      </span>
                    </label>
                    <input
                      name="isActive"
                      value={isActive || ""}
                      readOnly
                      hidden
                    />
                  </>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-brand-white">Title</span>
                    </label>
                    <input
                      name="title"
                      type="text"
                      placeholder="Title"
                      defaultValue={article?.title}
                      className="input input-bordered w-[95vw] text-brand-black sm:w-[320px]"
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-brand-white">
                        Description
                      </span>
                    </label>
                    <textarea
                      name="description"
                      placeholder="Description"
                      defaultValue={article?.description}
                      className="textarea textarea-bordered flex w-[95vw] rounded-none text-brand-black sm:w-[320px]"
                    />
                  </div>

                  <SelectArticleCategories
                    articleCategories={articleCategories}
                    valueToChange={article}
                    styles="w-[95vw] sm:w-[320px]"
                  />

                  <div className="form-control w-full max-w-xs">
                    <label className="label">
                      <span className="label-text text-brand-white">
                        Thumbnail
                      </span>
                    </label>
                    <div className="max-w-[500px]">
                      <UploadImage
                        defaultValue={article?.thumbnail}
                        name="thumbnail"
                      />
                    </div>
                  </div>

                  <input name="_action" value="updateMeta" hidden readOnly />

                  {metaValidationError && metaValidationError?.length > 0 && (
                    <div className="pb-3">
                      {metaValidationError.map((error: string, i: number) => {
                        return (
                          <p
                            key={error + i}
                            className="my-2 text-center text-xs text-red-500"
                          >
                            {error}
                          </p>
                        );
                      })}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="btn-primary btn-md mx-auto block w-max"
                  >
                    {article ? "Submit" : "Next Step"}
                  </button>
                </Form>
              }
            />

            {article && (
              <LargeCollapse
                forceOpen={article !== null}
                title="Page Content"
                content={
                  <PageBuilder
                    page={article}
                    searchResults={searchResults}
                    updateSuccess={updateSuccess}
                    productCategories={productCategories}
                    productSubCategories={productSubCategories}
                    articleCategories={articleCategories}
                    brands={brands}
                    colors={colors}
                    blockValidationError={blockValidationError}
                  />
                }
              />
            )}
          </div>
        </div>
      </div>
    </AdminPageWrapper>
  );
};

export default ModifyArticle;
