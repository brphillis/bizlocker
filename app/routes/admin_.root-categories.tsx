import {
  Form,
  Outlet,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from "@remix-run/react";
import { json, type LoaderArgs } from "@remix-run/server-runtime";
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
    perPage: Number(url.searchParams.get("itemsPerPage")) || 10,
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
      <Form method="GET" className="relative h-full w-full bg-base-300 p-6">
        <AdminPageHeader
          title="Manage Categories"
          addButtonText="Add Category"
        />

        <div className="mt-3 flex flex-col">
          <div className="flex flex-row gap-6">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Category Name</span>
              </label>
              <input
                name="rootCategory"
                className="input-bordered input w-full sm:w-[215px]"
                placeholder="Name"
                type="text"
              />
            </div>
          </div>

          <div className="collapse-arrow collapse mt-6 w-full max-w-[800px] rounded-none bg-base-200 sm:w-[800px]">
            <input type="checkbox" />
            <div className="collapse-title h-max text-sm font-medium">
              Search by sub-category
            </div>
            <div className="collapse-content">
              <div className="flex flex-row flex-wrap gap-6">
                <div className="form-control w-full max-w-xs">
                  <label className="label">
                    <span className="label-text">Product category</span>
                  </label>
                  <select
                    name="productCategory"
                    title="productCategory"
                    className=" select w-full max-w-xs"
                    placeholder="Select a Value"
                  >
                    <option value="">Select Product Categogry</option>
                    {productCategories.map(({ id, name }: ProductCategory) => {
                      return (
                        <option key={name + id} value={name}>
                          {name}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div className="form-control w-full max-w-xs">
                  <label className="label">
                    <span className="label-text">Article Category</span>
                  </label>
                  <select
                    name="articleCategory"
                    title="articleCategory"
                    className=" select w-full max-w-xs"
                    placeholder="Select a Value"
                  >
                    <option value="">Select Article Categogry</option>
                    {articleCategories.map(({ id, name }: ArticleCategory) => {
                      return (
                        <option key={name + id} value={name}>
                          {name}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-row justify-end sm:justify-start">
            <button type="submit" className="btn-primary btn mt-6 w-max">
              Search
            </button>
          </div>
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
                    className="hover cursor-pointer"
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
