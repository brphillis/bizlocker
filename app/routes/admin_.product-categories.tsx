import { json, type LoaderArgs } from "@remix-run/node";
import {
  Form,
  Link,
  Outlet,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from "@remix-run/react";
import Pagination from "~/components/Pagination";
import { searchProductCategories } from "~/models/productCategories.server";
import { capitalizeFirst } from "~/utility/stringHelpers";

export const loader = async ({ request }: LoaderArgs) => {
  const url = new URL(request.url);

  const searchQuery = {
    name: url.searchParams.get("name")?.toString() || undefined,
    page: Number(url.searchParams.get("pageNumber")) || 1,
    perPage: Number(url.searchParams.get("itemsPerPage")) || 10,
  };

  const { productCategories, totalPages } = await searchProductCategories(
    searchQuery
  );

  return json({ productCategories, totalPages });
};

const ProductCategories = () => {
  const navigate = useNavigate();
  const { productCategories, totalPages } = useLoaderData() as {
    productCategories: ProductCategory[];
    totalPages: number;
  };

  const [searchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("pageNumber")) || 1;

  return (
    <>
      <Form
        method="GET"
        className="relative mt-6 max-w-[99vw] rounded-lg border-t-4 border-primary bg-base-300 p-6"
      >
        <h1>Manage Product Categories</h1>
        <div className="mt-3 flex flex-col">
          <div className="flex flex-row">
            <div className="form-control mt-6 w-full max-w-xs">
              <input
                name="name"
                type="text"
                placeholder="Name"
                className="input-bordered input w-full max-w-xs"
              />
            </div>
          </div>
          <div className="flex flex-row justify-between">
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

            <Link to="/admin/products" className="btn-primary btn mt-6 w-max">
              Manage Products
            </Link>
          </div>
        </div>

        <div className="divider w-full" />

        <div className="my-6 flex justify-center">
          <div className="max-h-[55vh] max-w-[98vw] overflow-x-auto rounded-2xl">
            <table className="table w-[720px] rounded-xl">
              <thead className="sticky top-0">
                <tr>
                  {currentPage && <th>#</th>}
                  <th>Name</th>
                </tr>
              </thead>
              <tbody>
                {productCategories &&
                  productCategories.map(
                    ({ id, name }: ProductCategory, index) => {
                      return (
                        <tr
                          className="hover cursor-pointer"
                          onClick={() =>
                            navigate(`/admin/product-categories/${id}`)
                          }
                          key={id}
                        >
                          {currentPage && (
                            <td>
                              {index +
                                1 +
                                (currentPage - 1) * productCategories?.length}
                            </td>
                          )}
                          <td>{capitalizeFirst(name)}</td>
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

export default ProductCategories;
