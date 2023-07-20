import {
  Form,
  Outlet,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from "@remix-run/react";
import { json, type LoaderArgs } from "@remix-run/server-runtime";
import SelectArticleCategory from "~/components/Forms/Select/SelectArticleCategory";
import SelectProductCategory from "~/components/Forms/Select/SelectProductCategory";
import AdminPageHeader from "~/components/Layout/AdminPageHeader";
import AdminPageWrapper from "~/components/Layout/AdminPageWrapper";
import Pagination from "~/components/Pagination";
import { getArticleCategories } from "~/models/articleCategories.server";
import { getProductCategories } from "~/models/productCategories.server";
import { searchRootCategories } from "~/models/rootCategories.server";

export const loader = async ({ request }: LoaderArgs) => {
  const url = new URL(request.url);

  const searchQuery = {
    name: url.searchParams.get("rootCategory")?.toString() || undefined,
    productcategoryname:
      url.searchParams.get("productCategory")?.toString() || undefined,
    articlecategoryname:
      url.searchParams.get("articleCategory")?.toString() || undefined,
    page: Number(url.searchParams.get("pageNumber")) || 1,
    perPage: Number(url.searchParams.get("perPage")) || 10,
  };

  const { rootCategories, totalPages } = await searchRootCategories(
    searchQuery
  );
  const articleCategories = await getArticleCategories();
  const productCategories = await getProductCategories();

  return json({
    rootCategories,
    totalPages,
    articleCategories,
    productCategories,
  });
};

const ManageRootCategories = () => {
  const navigate = useNavigate();
  const { rootCategories, totalPages, productCategories, articleCategories } =
    (useLoaderData() as {
      rootCategories: RootCategory[];
      totalPages: number;
      productCategories: ProductCategory[];
      articleCategories: ArticleCategory[];
    }) || {};

  const [searchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("pageNumber")) || 1;

  return (
    <AdminPageWrapper>
      <Form
        method="GET"
        className="relative h-full w-full rounded-none bg-base-200 p-6"
      >
        <AdminPageHeader
          title="Manage Categories"
          addButtonText="Add Category"
        />

        <div className="mt-3 flex w-full flex-wrap items-end gap-6">
          <div className="flex w-full flex-row gap-6 sm:w-[215px]">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Category Name</span>
              </label>
              <input
                name="rootCategory"
                className="input w-full text-brand-black/50"
                placeholder="Name"
                type="text"
              />
            </div>
          </div>

          <SelectArticleCategory articleCategories={articleCategories} />

          <SelectProductCategory productCategories={productCategories} />
        </div>

        <div className="flex flex-row justify-end sm:justify-start">
          <button type="submit" className="btn-primary btn mt-6 w-max">
            Search
          </button>
        </div>

        <div className="divider w-full" />

        <div className="w-full max-w-[89vw] overflow-x-auto">
          <table className="table-sm my-3 table">
            <thead className="sticky top-0">
              <tr>
                {currentPage && <th>#</th>}
                <th>Title</th>
              </tr>
            </thead>
            <tbody>
              {rootCategories?.map(({ id, name }: RootCategory, i) => {
                return (
                  <tr
                    className="cursor-pointer transition-colors duration-200 hover:bg-base-100"
                    key={id}
                    onClick={() => navigate(`/admin/root-categories/${id}`)}
                  >
                    {currentPage && (
                      <td>
                        {i + 1 + (currentPage - 1) * rootCategories?.length}
                      </td>
                    )}
                    <td>{name}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <Pagination totalPages={totalPages} />
        </div>
      </Form>
      <Outlet />
    </AdminPageWrapper>
  );
};

export default ManageRootCategories;
