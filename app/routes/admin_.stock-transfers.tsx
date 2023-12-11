import { tokenAuth } from "~/auth.server";
import Pagination from "~/components/Pagination";
import { getStores } from "~/models/stores.server";
import { STAFF_SESSION_KEY } from "~/session.server";
import { capitalizeFirst } from "~/helpers/stringHelpers";
import BasicInput from "~/components/Forms/Input/BasicInput";
import { getApprovalStatusList } from "~/models/enums.server";
import BasicSelect from "~/components/Forms/Select/BasicSelect";
import { json, redirect, type LoaderArgs } from "@remix-run/node";
import AdminPageHeader from "~/components/Layout/_Admin/AdminPageHeader";
import AdminPageWrapper from "~/components/Layout/_Admin/AdminPageWrapper";
import {
  Form,
  Outlet,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from "@remix-run/react";
import {
  searchStockTransfers,
  type StockTransferRequestWithDetails,
} from "~/models/stock.server";

export const loader = async ({ request }: LoaderArgs) => {
  const authenticated = await tokenAuth(request, STAFF_SESSION_KEY);

  if (!authenticated.valid) {
    return redirect("/admin/login");
  }

  const url = new URL(request.url);

  const { stockTransfers, totalPages } = await searchStockTransfers(
    undefined,
    url
  );
  const statusList = await getApprovalStatusList();
  const stores = await getStores();

  return json({
    stockTransfers,
    totalPages,
    statusList,
    stores,
  });
};

const ManageStockTransfers = () => {
  const navigate = useNavigate();
  const { stockTransfers, totalPages, statusList, stores } = useLoaderData();
  const [searchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("pageNumber")) || 1;

  return (
    <AdminPageWrapper>
      <Form method="GET" className="relative h-full w-full bg-base-200 p-6">
        <AdminPageHeader
          title="Manage Stock Transfers"
          addButtonText="Add Transfer"
        />

        <div className="mt-3 flex flex-col">
          <div className="flex flex-row flex-wrap gap-6">
            <BasicInput name="sku" label="SKU" placeholder="Name" type="text" />

            <BasicSelect
              label="Status"
              name="status"
              placeholder="Select a Status"
              selections={statusList.map((e: string) => {
                return { id: e, name: capitalizeFirst(e) };
              })}
            />

            <BasicSelect
              label="From Store"
              name="fromStore"
              placeholder="Select a Store"
              selections={stores}
            />

            <BasicSelect
              label="To Store"
              name="toStore"
              placeholder="Select a Store"
              selections={stores}
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

        <div className="max-h-[520px] w-full max-w-[80vw] overflow-auto">
          <table className="table table-sm my-3">
            <thead className="sticky top-0">
              <tr>
                {currentPage && <th>#</th>}
                <th>SKU</th>
                <th>From Store</th>
                <th>To Store</th>
                <th>Status</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {stockTransfers?.map(
                (
                  {
                    id,
                    productVariant,
                    toStore,
                    fromStore,
                    status,
                    createdAt,
                  }: StockTransferRequestWithDetails,
                  i: number
                ) => {
                  const { sku } = productVariant || {};
                  const { name: toStoreName } = toStore || {};
                  const { name: fromStoreName } = fromStore || {};

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
                          {i + 1 + (currentPage - 1) * stockTransfers?.length}
                        </td>
                      )}
                      <td>{sku}</td>
                      <td>{fromStoreName}</td>
                      <td>{toStoreName}</td>
                      <td>{capitalizeFirst(status)}</td>
                      <td className="w-1/4">
                        {new Date(createdAt).toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
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

export default ManageStockTransfers;
