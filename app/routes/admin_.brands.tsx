import Pagination from "~/components/Pagination";
import { type LoaderArgs } from "@remix-run/node";
import { searchBrands } from "~/models/brands.server";
import { capitalizeFirst } from "~/helpers/stringHelpers";
import BasicInput from "~/components/Forms/Input/BasicInput";
import AdminPageHeader from "~/components/Layout/_Admin/AdminPageHeader";
import AdminPageWrapper from "~/components/Layout/_Admin/AdminPageWrapper";
import {
  Form,
  Outlet,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from "@remix-run/react";

export const loader = async ({ request }: LoaderArgs) => {
  const url = new URL(request.url);

  const { brands, totalPages } = await searchBrands(undefined, url);

  return { brands, totalPages };
};

const Brands = () => {
  const navigate = useNavigate();
  const { brands, totalPages } = useLoaderData() || {};

  const [searchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("pageNumber")) || 1;

  return (
    <AdminPageWrapper>
      <Form method="GET" className="relative h-full w-full bg-base-200 p-6">
        <AdminPageHeader title="Manage Brands" addButtonText="Add Brands" />

        <div className="mt-3 flex flex-col">
          <div className="flex flex-row">
            <BasicInput
              label="Brand Name"
              name="name"
              placeholder="Name"
              type="text"
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

        <div className="w-full max-w-[80vw] overflow-x-auto">
          <table className="table table-sm my-3">
            <thead className="sticky top-0">
              <tr>
                {currentPage && <th>#</th>}
                <th>Name</th>
              </tr>
            </thead>
            <tbody>
              {brands &&
                brands.map(({ id, name }: Brand, i: number) => {
                  return (
                    <tr
                      className="cursor-pointer transition-colors duration-200 hover:bg-base-100"
                      onClick={() => {
                        navigate(
                          `${location.pathname + "/" + id}${location.search}`
                        );
                      }}
                      key={id}
                    >
                      {currentPage && (
                        <td>{i + 1 + (currentPage - 1) * brands?.length}</td>
                      )}
                      <td>{capitalizeFirst(name)}</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>

        <Pagination totalPages={totalPages} />
      </Form>
      <Outlet />
    </AdminPageWrapper>
  );
};

export default Brands;
