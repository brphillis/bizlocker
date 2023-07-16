import Pagination from "~/components/Pagination";
import { searchBrands } from "~/models/brands.server";
import { json, type LoaderArgs } from "@remix-run/node";
import { capitalizeFirst } from "~/utility/stringHelpers";
import AdminPageHeader from "~/components/Layout/AdminPageHeader";
import AdminPageWrapper from "~/components/Layout/AdminPageWrapper";
import {
  Form,
  Outlet,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from "@remix-run/react";

export const loader = async ({ request }: LoaderArgs) => {
  const url = new URL(request.url);

  const searchQuery = {
    name: url.searchParams.get("name")?.toString() || undefined,
    page: Number(url.searchParams.get("pageNumber")) || 1,
    perPage: Number(url.searchParams.get("itemsPerPage")) || 10,
  };

  const { brands, totalPages } = await searchBrands(searchQuery);

  return json({ brands, totalPages });
};

const Brands = () => {
  const navigate = useNavigate();
  const { brands, totalPages } = useLoaderData() as {
    brands: Brand[];
    totalPages: number;
  };

  const [searchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("pageNumber")) || 1;

  return (
    <AdminPageWrapper>
      <Form method="GET" className="relative h-full w-full bg-base-300 p-6">
        <AdminPageHeader title="Manage Brands" addButtonText="Add Brands" />

        <div className="mt-3 flex flex-col">
          <div className="flex flex-row">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Brand Name</span>
              </label>
              <input
                name="name"
                type="text"
                placeholder="Name"
                className="input-bordered input w-full sm:w-[215px]"
              />
            </div>
          </div>

          <div className="flex flex-row justify-end sm:justify-start">
            <button type="submit" className="btn-primary btn mt-6 w-max">
              Search
            </button>
          </div>
        </div>

        <div className="divider w-full" />

        <div className="w-full max-w-[80vw] overflow-x-auto">
          <table className="table-sm my-3 table">
            <thead className="sticky top-0">
              <tr>
                {currentPage && <th>#</th>}
                <th>Name</th>
              </tr>
            </thead>
            <tbody>
              {brands &&
                brands.map(({ id, name }: Brand, i) => {
                  return (
                    <tr
                      className="hover cursor-pointer"
                      onClick={() => navigate(`/admin/brands/${id}`)}
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
