import {
  type ActionArgs,
  json,
  type LoaderArgs,
  type LinksFunction,
  redirect,
} from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";

import { getArticleCategories } from "~/models/articleCategories.server";
import {
  getArticle,
  updateArticleBlocks,
  upsertArticleInfo,
} from "~/models/articles.server";

import swiper from "../../node_modules/swiper/swiper.css";
import swiperNav from "../../node_modules/swiper/modules/navigation/navigation.min.css";
import AdminPageWrapper from "~/components/Layout/AdminPageWrapper";
import AdminPageHeader from "~/components/Layout/AdminPageHeader";
import Icon from "~/components/Icon";
import ContentBuilder from "~/components/PageBuilder/ContentBuilder";
import { searchPromotions } from "~/models/promotions.server";
import { searchCampaigns } from "~/models/campaigns.server";
import { removeBlock } from "~/models/pageBuilder.server";
import UploadImage from "~/components/Forms/Upload/UploadImage";
import SelectArticleCategories from "~/components/Forms/Select/SelectArticleCategories";
import LargeCollapse from "~/components/Collapse/LargeCollapse";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: swiper },
  { rel: "stylesheet", href: swiperNav },
];

export const loader = async ({ params }: LoaderArgs) => {
  const id = params?.id;

  const articleCategories = await getArticleCategories();

  if (id && id !== "add") {
    const article = await getArticle(id);
    return json({ article, articleCategories });
  } else return json({ articleCategories });
};

export const action = async ({ request, params }: ActionArgs) => {
  const id = params.id === "add" ? undefined : params.id;
  const form = Object.fromEntries(await request.formData());
  const {
    title,
    articleCategories,
    thumbnail,
    itemIndex,
    blockName,
    contentType,
    contentData,
    stringData,
    name,
  } = form;

  switch (form._action) {
    case "search":
      const searchQuery = {
        name: name as string,
        page: 1,
        perPage: 10,
      };

      let searchResults;

      switch (contentType) {
        case "promotion":
          const { promotions } = await searchPromotions(searchQuery);
          searchResults = promotions;
          return { searchResults };
        case "campaign":
          const { campaigns } = await searchCampaigns(searchQuery);
          searchResults = campaigns;

          return { searchResults };

        default:
          return { searchResults };
      }

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

      if (blockName && id) {
        let contentDataParsed = JSON.parse(contentData as string) as
          | Campaign[]
          | Promotion[];

        contentDataParsed = Array.isArray(contentDataParsed)
          ? contentDataParsed
          : [contentDataParsed];

        return await updateArticleBlocks(
          parseInt(itemIndex as string),
          blockName as BlockName,
          parseInt(id),
          contentType as BlockContentType,
          contentDataParsed,
          stringData as string
        );
      }

    case "delete":
      return await removeBlock(
        parseInt(id as string),
        parseInt(itemIndex as string)
      );
  }
};

const ModifyArticle = () => {
  const { article, articleCategories } =
    (useLoaderData() as {
      article: Article;
      articleCategories: ArticleCategory[];
    }) || {};

  const { searchResults } =
    (useActionData() as {
      searchResults: Promotion[] | Campaign[];
    }) || {};

  return (
    <AdminPageWrapper>
      <div className="relative h-full w-screen bg-base-300 p-6 sm:w-full">
        <AdminPageHeader title={article ? "Edit Article" : "Create Article"} />

        <div className="flex w-full justify-center">
          <div className="flex flex-col gap-6">
            <div className="flex justify-center gap-3 text-center text-2xl font-bold">
              <Icon iconName="IoNewspaper" size={24} styles="mt-[5px]" />
              Article {article ? "Editor" : "Creator"}
            </div>

            <LargeCollapse
              title="Information"
              content={
                <Form
                  method="POST"
                  className="flex w-full flex-col items-center gap-6"
                >
                  <div className="divider mb-0 w-full pb-0" />
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Title</span>
                    </label>
                    <input
                      name="title"
                      type="text"
                      placeholder="Title"
                      defaultValue={article?.title}
                      className="input-bordered input w-[95vw] sm:w-[320px]"
                    />
                  </div>

                  <SelectArticleCategories
                    articleCategories={articleCategories}
                    valueToChange={article}
                    styles="w-[95vw] sm:w-[320px]"
                  />

                  <div className="form-control w-full max-w-xs">
                    <label className="label">
                      <span className="label-text">Thumbnail</span>
                    </label>
                    <div className="max-w-[500px]">
                      <UploadImage
                        defaultValue={article?.thumbnail}
                        name="thumbnail"
                      />
                    </div>
                  </div>

                  <input name="_action" value="update" hidden readOnly />

                  <div className="divider my-0 w-full py-0" />
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
                title="Page Content"
                content={
                  <ContentBuilder
                    page={article}
                    searchResults={searchResults}
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
