import {
  Form,
  Link,
  Outlet,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from "@remix-run/react";
import { json, type LoaderArgs } from "@remix-run/server-runtime";
import parse from "html-react-parser";
import Pagination from "~/components/Pagination";
import { getBrands } from "~/models/brands.server";
import { getProductCategories } from "~/models/productCategories.server";
import { searchProducts } from "~/models/products.server";

export const loader = async ({ request }: LoaderArgs) => {
  const url = new URL(request.url);

  const searchQuery = {
    name: url.searchParams.get("name")?.toString() || undefined,
    category: url.searchParams.get("productCategory")?.toString() || undefined,
    brand: url.searchParams.get("brand")?.toString() || undefined,
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
    <>
      <Form
        method="GET"
        className="relative mt-3 max-w-[99vw] rounded-lg border-t-4 border-primary bg-base-300 p-6"
      >
        <h1>Manage Products</h1>
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
          <div className="flex flex-row flex-wrap justify-between">
            <div className="flex flex-row gap-2">
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

            <div className="flex gap-2">
              <Link
                to="/admin/product-categories"
                className="btn-primary btn mt-6 w-max"
              >
                Product Categories
              </Link>

              <Link to="/admin/brands" className="btn-primary btn mt-6 w-max">
                Brands
              </Link>
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
                  <th>Description</th>
                  <th>Category</th>
                  <th>Brand</th>
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
                        categories,
                        brand,
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
                            {categories?.map(
                              ({ id, name }: ProductCategory) => (
                                <p key={"category" + id + name}>{name}</p>
                              )
                            )}
                          </td>
                          <td>{brand?.name}</td>
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
        </div>

        <Pagination totalPages={totalPages} />
      </Form>
      <Outlet />
    </>
  );
};

export default ManageProducts;
