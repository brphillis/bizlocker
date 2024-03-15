import Pagination from "~/components/Pagination";
import BasicTable from "~/components/Tables/BasicTable";
import AdminContentSearch from "~/components/Search/AdminContentSearch";
import AdminPageHeader from "~/components/Layout/_Admin/AdminPageHeader";
import AdminPageWrapper from "~/components/Layout/Wrappers/AdminPageWrapper";
import {
  Form,
  Outlet,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from "@remix-run/react";

import { cartSearchLoader } from "./index.server";
import { CartWithDetails } from "~/models/Cart/types";

const CartSearch = () => {
  const { carts, totalPages } = useLoaderData<typeof cartSearchLoader>();

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const currentPage = Number(searchParams.get("pageNumber")) || 1;

  return (
    <AdminPageWrapper>
      <Form method="GET" className="relative h-full w-full bg-base-200 p-6">
        <AdminPageHeader
          title="Manage Carts"
          buttonLabel="Add Cart"
          buttonLink="/admin/upsert/cart?contentId=add"
        />

        <AdminContentSearch email={true} />

        <div className="divider w-full" />

        {carts && carts.length > 0 && (
          <BasicTable
            onRowClick={(id) => navigate(`/admin/upsert/cart?contentId=${id}`)}
            currentPage={currentPage}
            objectArray={carts.map((e: CartWithDetails) => ({
              id: e.id,
              email: e.user?.email || "Guest",
              createdAt: e.createdAt,
              lastUpdated: e.updatedAt,
            }))}
          />
        )}

        <Pagination totalPages={totalPages} />
      </Form>
      <Outlet />
    </AdminPageWrapper>
  );
};

export default CartSearch;
