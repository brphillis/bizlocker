import {
  Form,
  Outlet,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from "@remix-run/react";
import { json, type LoaderArgs } from "@remix-run/server-runtime";
import parse from "html-react-parser";
import AdminPageHeader from "~/components/Layout/AdminPageHeader";
import AdminPageWrapper from "~/components/Layout/AdminPageWrapper";
import Pagination from "~/components/Pagination";
import ProductSort from "~/components/Sorting/ProductSort";
import { getBrands } from "~/models/brands.server";
import { getProductCategories } from "~/models/productCategories.server";
import { searchProducts } from "~/models/products.server";

export const loader = async ({ request }: LoaderArgs) => {
  const url = new URL(request.url);

  const searchQuery = {
    name: url.searchParams.get("name")?.toString() || undefined,
    category: url.searchParams.get("productCategory")?.toString() || undefined,
    brand: url.searchParams.get("brand")?.toString() || undefined,
    sortBy: (url.searchParams.get("sortBy") as SortBy) || undefined,
    sortOrder: (url.searchParams.get("sortOrder") as SortOrder) || undefined,
    page: Number(url.searchParams.get("pageNumber")) || 1,
    perPage: Number(url.searchParams.get("itemsPerPage")) || 10,
  };

  const { products, totalPages } = await searchProducts(searchQuery);
  const brands = await getBrands();
  const productCategories = await getProductCategories();

  return json({
    products,
    brands,
    productCategories,
    totalPages,
  });
};

const ManageProducts = () => {
  const navigate = useNavigate();
  const { products, totalPages, productCategories, brands } =
    (useLoaderData() as {
      products: Product[];
      productCategories: ProductCategory[];
      brands: Brand[];
      totalPages: number;
    }) || {};
  const [searchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("pageNumber")) || 1;

  return (
    <AdminPageWrapper>
      <Form method="GET" className="relative h-full w-full bg-base-300 p-6">
        <AdminPageHeader title="Manage Products" addButtonText="Add Products" />

        <div className="mt-3 flex flex-col">
          <div className="flex flex-row flex-wrap gap-6">
            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">Name</span>
              </label>
              <input
                name="name"
                type="text"
                placeholder="Name"
                className="input-bordered input w-full max-w-xs"
              />
            </div>

            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">Category</span>
              </label>
              <select
                name="productCategory"
                className="select-bordered select w-full max-w-xs"
                placeholder="Select a Value"
              >
                <option value="">Select a Category</option>
                {productCategories?.map(({ id, name }: ProductCategory) => {
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
                <span className="label-text">Brand</span>
              </label>
              <select
                name="brand"
                className="select-bordered select w-full max-w-xs"
                placeholder="Select a Value"
              >
                <option value="">Select a Brand</option>
                {brands?.map(({ id, name }: Brand) => {
                  return (
                    <option key={name + id} value={name}>
                      {name}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
          <div className="flex flex-row justify-end sm:justify-start">
            <button type="submit" className="btn-primary btn mt-6 w-max">
              Search
            </button>
          </div>
        </div>

        <div className="divider mb-0 w-full" />

        <ProductSort />

        <div className="w-full max-w-[80vw] overflow-x-auto">
          <table className="table-zebra table-sm my-3 table">
            <thead className="sticky top-0">
              <tr>
                {currentPage && <th>#</th>}
                <th>Title</th>
                <th>Description</th>
                <th>Category</th>
                <th>Brand</th>
                <th>Sold</th>
                <th>Active</th>
              </tr>
            </thead>
            <tbody>
              {products &&
                products?.map(
                  (
                    {
                      id,
                      name,
                      description,
                      productCategories,
                      brand,
                      totalSold,
                      isActive,
                    }: Product,
                    index
                  ) => {
                    return (
                      <tr
                        className="hover cursor-pointer"
                        key={"product" + id}
                        onClick={() => navigate(`/admin/products/${id}`)}
                      >
                        {currentPage && (
                          <td>
                            {index + 1 + (currentPage - 1) * products?.length}
                          </td>
                        )}
                        <td>{name}</td>
                        <td>{parse(description.substring(0, 50))}</td>
                        <td>
                          {productCategories?.map(
                            ({ id, name }: ProductCategory) => (
                              <p key={"category" + id + name}>{name}</p>
                            )
                          )}
                        </td>
                        <td>{brand?.name}</td>
                        <td>{totalSold}</td>
                        <td>
                          {!isActive && (
                            <div className="ml-4 h-3 w-3 rounded-full bg-red-500" />
                          )}
                          {isActive && (
                            <div className="ml-4 h-3 w-3 self-center rounded-full bg-success" />
                          )}
                        </td>
                      </tr>
                    );
                  }
                )}
            </tbody>
          </table>
        </div>

        <Pagination totalPages={totalPages} />
      </Form>
      <Outlet />
    </AdminPageWrapper>
  );
};

export default ManageProducts;
