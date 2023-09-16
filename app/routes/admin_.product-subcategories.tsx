import Pagination from "~/components/Pagination";
import { type LoaderArgs } from "@remix-run/node";
import { capitalizeFirst } from "~/utility/stringHelpers";
import AdminPageHeader from "~/components/Layout/_Admin/AdminPageHeader";
import AdminPageWrapper from "~/components/Layout/_Admin/AdminPageWrapper";
import { searchProductSubCategories } from "~/models/productSubCategories.server";
import {
  Form,
  Outlet,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from "@remix-run/react";
import CategorySort from "~/components/Sorting/CategorySort";
import SelectProductCategory from "~/components/Forms/Select/SelectProductCategory";
import { getProductCategories } from "~/models/productCategories.server";

export const loader = async ({ request }: LoaderArgs) => {
  const url = new URL(request.url);

  const { productSubCategories, totalPages } = await searchProductSubCategories(
    undefined,
    url
  );

  const productCategories = await getProductCategories();

  return { productSubCategories, productCategories, totalPages };
};

const ProductSubCategories = () => {
  const navigate = useNavigate();
  const { productSubCategories, productCategories, totalPages } =
    useLoaderData() || {};

  const [searchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("pageNumber")) || 1;

  return (
    <AdminPageWrapper>
      <Form method="GET" className="relative h-full w-full bg-base-200 p-6">
        <AdminPageHeader
          title="Manage Product Sub Categories"
          addButtonText="Add Product Sub Category"
        />

        <div className="mt-3 flex w-full flex-wrap items-end gap-6">
          <div className="flex w-full flex-row gap-6 sm:w-[215px]">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Sub Category Name</span>
              </label>
              <input
                name="name"
                className="input w-full text-brand-black/50"
                placeholder="Name"
                type="text"
              />
            </div>
          </div>

          <SelectProductCategory productCategories={productCategories} />
        </div>

        <div className="flex flex-row justify-end sm:justify-start">
          <button type="submit" className="btn btn-primary mt-6 w-max">
            Search
          </button>
        </div>

        <div className="divider w-full" />

        <CategorySort />

        <div className="w-full max-w-[80vw] overflow-x-auto">
          <table className="table table-sm my-3">
            <thead className="sticky top-0">
              <tr>
                {currentPage && <th className="w-[10%]">#</th>}
                <th className="w-[30%]">Name</th>
                <th className="w-[20%]">Index</th>
                <th className="w-[20%]">In Navigation</th>
                <th className="w-[20%]">Active</th>
              </tr>
            </thead>
            <tbody>
              {productSubCategories &&
                productSubCategories.map(
                  (
                    {
                      id,
                      name,
                      index,
                      displayInNavigation,
                      isActive,
                    }: ProductSubCategory,
                    i: number
                  ) => {
                    return (
                      <tr
                        className="cursor-pointer transition-colors duration-200 hover:bg-base-100"
                        onClick={() =>
                          navigate(`/admin/product-subcategories/${id}`)
                        }
                        key={id}
                      >
                        {currentPage && (
                          <td>
                            {i +
                              1 +
                              (currentPage - 1) * productSubCategories?.length}
                          </td>
                        )}
                        <td>{capitalizeFirst(name)}</td>
                        <td>{index}</td>
                        <td>
                          {!displayInNavigation && (
                            <div className="ml-4 h-3 w-3 rounded-full bg-red-500" />
                          )}
                          {displayInNavigation && (
                            <div className="ml-4 h-3 w-3 self-center rounded-full bg-success" />
                          )}
                        </td>
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

export default ProductSubCategories;
