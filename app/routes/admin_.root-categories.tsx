import {
  Form,
  Outlet,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from "@remix-run/react";
import { json, type LoaderArgs } from "@remix-run/server-runtime";
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
    <>
      <Form
        method="GET"
        className="relative mt-3 max-w-[99vw] rounded-lg border-t-4 border-primary bg-base-300 p-6"
      >
        <h1>Manage Categories</h1>
        <div className="mt-3 flex flex-col">
          <div className="flex flex-row gap-6">
            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">Category Name</span>
              </label>
              <input
                name="rootCategory"
                className="input-bordered input w-full max-w-xs"
                placeholder="Title"
                type="text"
              />
            </div>
          </div>

          <div className="collapse-arrow collapse mt-6 bg-base-200">
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
                    className="select-bordered select w-full max-w-xs"
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
                    className="select-bordered select w-full max-w-xs"
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

          <div className="flex flex-row flex-wrap justify-between">
            <div className="mr-10 flex flex-row flex-wrap gap-2">
              <button type="submit" className="btn-primary btn mt-6 w-max">
                Search
              </button>

              <button
                type="button"
                className="btn-primary btn mt-6 w-max"
                onClick={() => navigate("add")}
              >
                +
              </button>
            </div>
          </div>
        </div>

        <div className="divider w-full" />

        <div className="my-6 flex justify-center">
          <div className="max-h-[55vh] max-w-[98vw] overflow-x-auto rounded-2xl">
            <table className="table w-[720px] rounded-xl">
              <thead className="sticky top-0">
                <tr>
                  {currentPage && <th>#</th>}
                  <th>Title</th>
                </tr>
              </thead>
              <tbody>
                {rootCategories?.map(({ id, name }: RootCategory, index) => {
                  return (
                    <tr
                      className="hover cursor-pointer"
                      key={id}
                      onClick={() => navigate(`/admin/categories/${id}`)}
                    >
                      {currentPage && (
                        <td>
                          {index +
                            1 +
                            (currentPage - 1) * rootCategories?.length}
                        </td>
                      )}
                      <td>{name}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <Pagination totalPages={totalPages} />
      </Form>
      <Outlet />
    </>
  );
};

export default ManageRootCategories;
