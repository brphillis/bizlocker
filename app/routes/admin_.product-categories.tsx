import Pagination from "~/components/Pagination";
import { redirect, type LoaderArgs } from "@remix-run/server-runtime";
import CategorySort from "~/components/Sorting/CategorySort";
import { getDepartments } from "~/models/departments.server";
import BasicInput from "~/components/Forms/Input/BasicInput";
import BasicSelect from "~/components/Forms/Select/BasicSelect";
import AdminPageHeader from "~/components/Layout/_Admin/AdminPageHeader";
import AdminPageWrapper from "~/components/Layout/_Admin/AdminPageWrapper";
import {
  type ProductCategoryWithDetails,
  searchProductCategories,
} from "~/models/productCategories.server";
import { getProductSubCategories } from "~/models/productSubCategories.server";
import { json } from "@remix-run/node";
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

  const { productCategories, totalPages } = await searchProductCategories(
    undefined,
    url
  );
  const departments = await getDepartments();
  const productSubCategories = await getProductSubCategories();

  return json({
    productCategories,
    totalPages,
    departments,
    productSubCategories,
  });
};

const ManageProductCategories = () => {
  const navigate = useNavigate();
  const { productCategories, totalPages, productSubCategories, departments } =
    useLoaderData<typeof loader>();

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
          <BasicInput
            label="Category Name"
            type="text"
            name="name"
            placeholder="Name"
          />

          <BasicSelect
            name="department"
            label="Department"
            selections={departments}
            placeholder="Department"
          />

          <BasicSelect
            name="productSubCategory"
            label="Category"
            selections={productSubCategories}
            placeholder="Category"
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

        <div className="divider w-full" />

        <CategorySort />

        <div className="w-full max-w-[89vw] overflow-x-auto">
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
              {productCategories?.map(
                (
                  {
                    id,
                    name,
                    index,
                    displayInNavigation,
                    isActive,
                  }: ProductCategoryWithDetails,
                  i: number
                ) => {
                  return (
                    <tr
                      className="cursor-pointer transition-colors duration-200 hover:bg-base-100"
                      key={id}
                      onClick={() => {
                        navigate(
                          `${location.pathname + "/" + id}${location.search}`
                        );
                      }}
                    >
                      {currentPage && (
                        <td>
                          {i +
                            1 +
                            (currentPage - 1) * productCategories?.length}
                        </td>
                      )}
                      <td>{name}</td>
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
          <Pagination totalPages={totalPages} />
        </div>
      </Form>
      <Outlet />
    </AdminPageWrapper>
  );
};

export default ManageProductCategories;
