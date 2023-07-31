import {
  Form,
  Outlet,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from "@remix-run/react";
import { json, type LoaderArgs } from "@remix-run/server-runtime";
import parse from "html-react-parser";
import SelectBrand from "~/components/Forms/Select/SelectBrand";
import SelectProductCategory from "~/components/Forms/Select/SelectProductCategory";
import AdminPageHeader from "~/components/Layout/AdminPageHeader";
import AdminPageWrapper from "~/components/Layout/AdminPageWrapper";
import Pagination from "~/components/Pagination";
import ProductSort from "~/components/Sorting/ProductSort";
import { getBrands } from "~/models/brands.server";
import { getProductCategories } from "~/models/productCategories.server";
import { searchProducts } from "~/models/products.server";

export const loader = async ({ request }: LoaderArgs) => {
  const url = new URL(request.url);

  const { products, totalPages } = await searchProducts(undefined, url);
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
  const { products, totalPages, productCategories, brands } = useLoaderData();
  const [searchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("pageNumber")) || 1;

  return (
    <AdminPageWrapper>
      <Form method="GET" className="relative h-full w-full bg-base-200 p-6">
        <AdminPageHeader title="Manage Products" addButtonText="Add Products" />

        <div className="mt-3 flex flex-col">
          <div className="flex flex-row flex-wrap gap-6">
            <div className="form-control w-full sm:w-[215px]">
              <label className="label">
                <span className="label-text">Name</span>
              </label>
              <input
                name="name"
                type="text"
                placeholder="Name"
                className="input input-bordered w-full"
              />
            </div>

            <SelectProductCategory productCategories={productCategories} />
            <SelectBrand brands={brands} />
          </div>
          <div className="flex flex-row justify-end sm:justify-start">
            <button type="submit" className="btn btn-primary mt-6 w-max">
              Search
            </button>
          </div>
        </div>

        <div className="divider w-full" />

        <ProductSort />

        <div className="w-full max-w-[80vw] overflow-x-auto">
          <table className="table table-sm my-3">
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
                    i: number
                  ) => {
                    return (
                      <tr
                        className="cursor-pointer transition-colors duration-200 hover:bg-base-100"
                        key={"product" + id}
                        onClick={() => navigate(`/admin/products/${id}`)}
                      >
                        {currentPage && (
                          <td>
                            {i + 1 + (currentPage - 1) * products?.length}
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
