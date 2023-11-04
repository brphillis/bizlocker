import Pagination from "~/components/Pagination";
import { getBrands } from "~/models/brands.server";
import { searchProducts } from "~/models/products.server";
import ProductSort from "~/components/Sorting/ProductSort";
import { redirect, type LoaderArgs } from "@remix-run/server-runtime";
import BasicInput from "~/components/Forms/Input/BasicInput";
import BasicSelect from "~/components/Forms/Select/BasicSelect";
import AdminPageHeader from "~/components/Layout/_Admin/AdminPageHeader";
import AdminPageWrapper from "~/components/Layout/_Admin/AdminPageWrapper";
import { getProductSubCategories } from "~/models/productSubCategories.server";
import {
  Form,
  Outlet,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from "@remix-run/react";
import { tokenAuth } from "~/auth.server";
import { STAFF_SESSION_KEY } from "~/session.server";

export const loader = async ({ request }: LoaderArgs) => {
  const authenticated = await tokenAuth(request, STAFF_SESSION_KEY);
  if (!authenticated.valid) {
    return redirect("/admin/login");
  }

  const url = new URL(request.url);

  const { products, totalPages } = await searchProducts(undefined, url);
  const brands = await getBrands();
  const productSubCategories = await getProductSubCategories();

  return {
    products,
    brands,
    productSubCategories,
    totalPages,
  };
};

const ManageProducts = () => {
  const navigate = useNavigate();
  const { products, totalPages, productSubCategories, brands } =
    useLoaderData();
  const [searchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("pageNumber")) || 1;

  return (
    <AdminPageWrapper>
      <Form method="GET" className="relative h-full w-full bg-base-200 p-6">
        <AdminPageHeader title="Manage Products" addButtonText="Add Products" />

        <div className="mt-3 flex flex-col">
          <div className="flex flex-row flex-wrap gap-6">
            <BasicInput
              name="name"
              label="Name"
              placeholder="Name"
              type="text"
            />

            <BasicSelect
              label="Category"
              name="productSubCategory"
              placeholder="Select a Category"
              selections={productSubCategories}
            />

            <BasicSelect
              label="Brand"
              name="brand"
              placeholder="Brand"
              selections={brands}
            />
          </div>
          <div className="flex flex-row justify-end sm:justify-start">
            <button
              type="submit"
              className="btn btn-primary mt-6 w-max !rounded-sm"
            >
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
                      productSubCategories,
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
                        onClick={() => {
                          navigate(
                            `${location.pathname + "/" + id}${location.search}`
                          );
                        }}
                      >
                        {currentPage && (
                          <td>
                            {i + 1 + (currentPage - 1) * products?.length}
                          </td>
                        )}
                        <td>{name}</td>
                        <td>
                          {productSubCategories?.map(
                            ({ id, name }: ProductSubCategory) => (
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
