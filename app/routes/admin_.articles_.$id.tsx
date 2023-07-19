import {
  type ActionArgs,
  json,
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
import AdminPageWrapper from "~/components/Layout/AdminPageWrapper";
import AdminPageHeader from "~/components/Layout/AdminPageHeader";
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
import { getRootCategories } from "~/models/rootCategories.server";
import { getProductCategories } from "~/models/productCategories.server";
import { getBrands } from "~/models/brands.server";
import {
  getFormBlockOptions,
  getBlockUpdateValues,
  searchContentData,
} from "~/utility/pageBuilder";
import { HiTrash } from "react-icons/hi2";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: swiper },
  { rel: "stylesheet", href: swiperNav },
];

export const loader = async ({ params }: LoaderArgs) => {
  const id = params?.id;

  const articleCategories = await getArticleCategories();
  const rootCategories = await getRootCategories();
  const productCategories = await getProductCategories();
  const brands = await getBrands();

  if (id && id !== "add") {
    const article = await getArticle(id);
    return json({
      article,
      articleCategories,
      rootCategories,
      productCategories,
      brands,
    });
  } else return json({ articleCategories });
};

export const action = async ({ request, params }: ActionArgs) => {
  const id = params.id === "add" ? undefined : params.id;
  const form = Object.fromEntries(await request.formData());
  const { title, articleCategories, thumbnail, itemIndex, contentType, name } =
    form;

  const blockOptions: NewBlockOptions = getFormBlockOptions(form);

  switch (form._action) {
    case "search":
      return await searchContentData(
        name as string,
        contentType as BlockContentType
      );

    case "update":
      //we create a new article if ID is not provided
      if (title || thumbnail || articleCategories) {
        const articleId = await upsertArticleInfo(
          title as string,
          JSON.parse(articleCategories as string),
          JSON.parse(thumbnail as string),
          id ? parseInt(id) : undefined
        );

        if (params.id === "add") {
          return redirect(`/admin/articles/${articleId}`);
        } else return null;
      }

      const newBlockData: NewBlockData = getBlockUpdateValues(form);

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
        parseInt(itemIndex as string)
      );

    case "deleteArticle":
      return await deleteArticle(parseInt(id as string));
  }
};

const ModifyArticle = () => {
  const submit = useSubmit();
  const {
    article,
    rootCategories,
    articleCategories,
    productCategories,
    brands,
  } =
    (useLoaderData() as {
      article: Article;
      articleCategories: ArticleCategory[];
      rootCategories: RootCategory[];
      productCategories: ProductCategory[];
      brands: Brand[];
    }) || {};

  const { searchResults, updateSuccess } =
    (useActionData() as {
      searchResults: Promotion[] | Campaign[];
      updateSuccess: boolean;
    }) || {};

  return (
    <AdminPageWrapper>
      <div className="relative h-full w-screen bg-base-200 p-6 sm:w-full">
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
              title="Information"
              forceOpen={!article}
              content={
                <Form
                  method="POST"
                  className="flex w-full flex-col items-center gap-6"
                >
                  <div className="divider mb-0 w-full pb-0" />
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-brand-white">Title</span>
                    </label>
                    <input
                      name="title"
                      type="text"
                      placeholder="Title"
                      defaultValue={article?.title}
                      className="input-bordered input w-[95vw] text-brand-black sm:w-[320px]"
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

                  <input name="_action" value="update" hidden readOnly />
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
                    rootCategories={rootCategories}
                    productCategories={productCategories}
                    brands={brands}
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
