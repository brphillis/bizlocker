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
import {
  deleteWebPage,
  getWebPage,
  upsertWebPageInfo,
} from "~/models/webPages.server";

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

  if (id && id !== "add") {
    const webPage = await getWebPage(id);
    return {
      webPage,
      articleCategories,
      productCategories,
      productSubCategories,
      brands,
    };
  } else return null;
};

export const action = async ({ request, params }: ActionArgs) => {
  const id = params.id === "add" ? undefined : params.id;
  const form = Object.fromEntries(await request.formData());
  const { title, description, thumbnail, itemIndex, contentType, name } = form;

  const blockOptions: NewBlockOptions = getFormBlockOptions(form);

  switch (form._action) {
    case "search":
      return await searchContentData(
        contentType as BlockContentType,
        (name as string) || undefined
      );

    case "update":
      //we create a new webPage if ID is not provided
      if (title || thumbnail) {
        const webPageId = await upsertWebPageInfo(
          title as string,
          description as string,
          thumbnail ? JSON.parse(thumbnail as string) : undefined,
          id ? parseInt(id) : undefined
        );

        if (params.id === "add") {
          return redirect(`/admin/pages/${webPageId}`);
        } else return null;
      }

      const newBlockData: NewBlockData = getBlockUpdateValues(form);

      const updateSuccess = await updatePageBlock(
        "webPage",
        parseInt(id as string),
        newBlockData,
        blockOptions
      );

      return { updateSuccess };

    case "rearrange":
      const { direction } = form;

      return await changeBlockOrder(
        "webPage",
        parseInt(id as string),
        parseInt(itemIndex as string),
        direction as "up" | "down"
      );

    case "delete":
      return await removeBlock(
        parseInt(id as string),
        parseInt(itemIndex as string),
        "webPage"
      );

    case "deleteWebPage":
      return await deleteWebPage(parseInt(id as string));
  }
};

const ModifyWebPage = () => {
  const submit = useSubmit();
  const {
    webPage,
    productCategories,
    articleCategories,
    productSubCategories,
    brands,
  } = useLoaderData() || {};

  const { searchResults, updateSuccess } = useActionData() || {};

  return (
    <AdminPageWrapper>
      <div className="relative h-full w-full bg-base-200 p-6 sm:w-full">
        <div className="hidden sm:block">
          <AdminPageHeader title={webPage ? "Edit Page" : "Create Page"} />
        </div>

        <div className="flex w-full justify-center">
          <div className="flex flex-col gap-6">
            <div className="relative flex justify-center gap-3 text-center text-2xl font-bold">
              <Icon iconName="IoNewspaper" size={24} styles="mt-[5px]" />
              {webPage ? webPage.title : "Create Page"}

              <HiTrash
                size={24}
                className="bg-brand-lightest text-brand-lightest/50 absolute right-3 top-2 cursor-pointer rounded-full bg-error p-[0.3rem] text-brand-white"
                onClick={() => {
                  const formData = new FormData();
                  formData.set("_action", "deleteWebPage");
                  submit(formData, { method: "POST" });
                }}
              />
            </div>

            <LargeCollapse
              title="Meta Information"
              forceOpen={!webPage}
              content={
                <Form
                  method="POST"
                  className="flex w-full flex-col items-center gap-6"
                >
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-brand-white">Title</span>
                    </label>
                    <input
                      name="title"
                      type="text"
                      placeholder="Title"
                      defaultValue={webPage?.title}
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
                      defaultValue={webPage?.description}
                      className="textarea textarea-bordered flex w-[95vw] rounded-none text-brand-black sm:w-[320px]"
                    />
                  </div>

                  <div className="form-control w-full max-w-xs">
                    <label className="label">
                      <span className="label-text text-brand-white">
                        Thumbnail
                      </span>
                    </label>
                    <div className="max-w-[500px]">
                      <UploadImage
                        defaultValue={webPage?.thumbnail}
                        name="thumbnail"
                      />
                    </div>
                  </div>

                  <input name="_action" value="update" hidden readOnly />
                  <button
                    type="submit"
                    className="btn-primary btn-md mx-auto block w-max"
                  >
                    {webPage ? "Submit" : "Next Step"}
                  </button>
                </Form>
              }
            />

            {webPage && (
              <LargeCollapse
                forceOpen={webPage !== null}
                title="Page Content"
                content={
                  <PageBuilder
                    page={webPage}
                    searchResults={searchResults}
                    updateSuccess={updateSuccess}
                    productCategories={productCategories}
                    productSubCategories={productSubCategories}
                    brands={brands}
                    articleCategories={articleCategories}
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

export default ModifyWebPage;
