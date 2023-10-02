import { HiTrash } from "react-icons/hi2";
import PageBuilder from "~/components/PageBuilder";
import { getBrands } from "~/models/brands.server";
import { getBlocks } from "~/helpers/blockHelpers";
import { getAvailableColors } from "~/models/enums.server";
import BasicInput from "~/components/Forms/Input/BasicInput";
import UploadImage from "~/components/Forms/Upload/UploadImage";
import LargeCollapse from "~/components/Collapse/LargeCollapse";
import { getArticleCategories } from "~/models/articleCategories.server";
import AdminPageHeader from "~/components/Layout/_Admin/AdminPageHeader";
import { getProductCategories } from "~/models/productCategories.server";
import AdminPageWrapper from "~/components/Layout/_Admin/AdminPageWrapper";
import { getProductSubCategories } from "~/models/productSubCategories.server";
import {
  Form,
  useActionData,
  useLoaderData,
  useSubmit,
} from "@remix-run/react";
import {
  deleteWebPage,
  getWebPage,
  upsertWebPageInfo,
} from "~/models/webPages.server";
import {
  changeBlockOrder,
  removeBlock,
  updatePageBlock,
} from "~/models/pageBuilder.server";
import {
  redirect,
  type ActionArgs,
  type LinksFunction,
  type LoaderArgs,
} from "@remix-run/node";
import {
  getBlockUpdateValues,
  getFormBlockOptions,
  searchContentData,
} from "~/utility/pageBuilder";
import swiper from "../../node_modules/swiper/swiper.css";
import swiperNav from "../../node_modules/swiper/modules/navigation/navigation.min.css";
import { limitString } from "~/helpers/stringHelpers";
import BasicSelect from "~/components/Forms/Select/BasicSelect";
import PatternBackground from "~/components/Layout/PatternBackground";
import { generateColor } from "~/utility/colors";

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
    const webPage = await getWebPage(id);
    let blocks;

    if (webPage) {
      blocks = await getBlocks(webPage as any);
    }

    return {
      webPage,
      blocks,
      articleCategories,
      productCategories,
      productSubCategories,
      brands,
      colors,
    };
  } else return null;
};

export const action = async ({ request, params }: ActionArgs) => {
  const id = params.id === "add" ? undefined : params.id;
  const form = Object.fromEntries(await request.formData());
  const {
    backgroundColor,
    blockId,
    blockName,
    contentType,
    description,
    itemIndex,
    name,
    thumbnail,
    title,
  } = form;

  const blockOptions: BlockOptions = getFormBlockOptions(form);

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

      if (metaValidationError.length > 0) {
        return { metaValidationError };
      }

      const webPageId = await upsertWebPageInfo(
        title as string,
        description as string,
        thumbnail ? JSON.parse(thumbnail as string) : undefined,
        backgroundColor as string,
        id ? parseInt(id) : undefined
      );

      if (params.id === "add") {
        return redirect(`/admin/pages/${webPageId}`);
      } else return null;

    case "update":
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
      return await removeBlock(blockId as string, blockName as BlockName);

    case "deleteWebPage":
      return await deleteWebPage(parseInt(id as string));
  }
};

const ModifyWebPage = () => {
  const submit = useSubmit();
  const {
    webPage,
    blocks,
    productCategories,
    articleCategories,
    productSubCategories,
    brands,
    colors,
  } = useLoaderData() || {};

  const { searchResults, updateSuccess, metaValidationError } =
    useActionData() || {};

  return (
    <AdminPageWrapper>
      <div className="relative h-full w-full bg-base-200 p-6 sm:w-full">
        <div className="absolute left-0 top-0 h-full w-full bg-brand-white"></div>
        <PatternBackground
          name="isometric"
          backgroundColor={generateColor("BLACK")}
          patternColor={generateColor("WHITE")}
          patternOpacity={0.2}
          patternSize={140}
          brightness={-1.5}
        />

        <div className="hidden sm:block">
          <AdminPageHeader title={webPage ? "Edit Page" : "Create Page"} />
        </div>

        <div className="flex w-full justify-center">
          <div className="flex flex-col gap-6">
            <div className="relative flex justify-center gap-3 rounded-sm bg-brand-black py-6 text-center text-2xl font-bold text-brand-white">
              {webPage ? limitString(webPage.title, 21, true) : "Create Page"}

              <HiTrash
                size={28}
                className="bg-brand-lightest text-brand-lightest/50 absolute right-6 top-7 cursor-pointer rounded-full bg-error p-[0.3rem] text-brand-white"
                onClick={() => {
                  const formData = new FormData();
                  formData.set("_action", "deleteWebPage");
                  submit(formData, { method: "POST" });
                }}
              />
            </div>

            <LargeCollapse
              title="Page Options"
              forceOpen={!webPage}
              content={
                <Form
                  method="POST"
                  className="flex w-full flex-col items-center gap-6"
                >
                  <BasicInput
                    name="title"
                    label="Title"
                    placeholder="Title"
                    customWidth="w-[320px]"
                    type="text"
                    defaultValue={webPage?.title}
                    labelColor="text-brand-white"
                  />

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
                      className="textarea textarea-bordered flex w-[95vw] rounded-sm text-brand-black sm:w-[320px]"
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

                  {colors && (
                    <BasicSelect
                      label="Background Color"
                      labelColor="text-brand-white"
                      customWidth="w-[320px]"
                      name="backgroundColor"
                      placeholder="Select a Color"
                      defaultValue={webPage?.backgroundColor}
                      selections={colors?.map((color: string) => ({
                        id: color,
                        name: color,
                      }))}
                    />
                  )}

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
                    className="btn-primary btn-md mx-auto block w-max rounded-sm"
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
                    blocks={blocks}
                    searchResults={searchResults}
                    updateSuccess={updateSuccess}
                    productCategories={productCategories}
                    productSubCategories={productSubCategories}
                    articleCategories={articleCategories}
                    brands={brands}
                    colors={colors}
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
