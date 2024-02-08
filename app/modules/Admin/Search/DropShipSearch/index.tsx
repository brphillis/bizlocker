import Pagination from "~/components/Pagination";
import AdminPageHeader from "~/components/Layout/_Admin/AdminPageHeader";
import AdminPageWrapper from "~/components/Layout/Wrappers/AdminPageWrapper";
import {
  Form,
  Outlet,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from "@remix-run/react";
import BasicTable from "~/components/Tables/BasicTable";
import AdminContentSearch from "~/components/Search/AdminContentSearch";
import { AliExpressHubSearch_Result } from "~/integrations/aliexpress/types";
import { dropshipSearchLoader } from "./index.server";

const DropshipSearch = () => {
  const { products, totalPages } =
    useLoaderData<typeof dropshipSearchLoader>() || {};

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const currentPage = Number(searchParams.get("pageNumber")) || 1;

  return (
    <AdminPageWrapper>
      <Form method="GET" className="relative h-full w-full bg-base-200 p-6">
        <AdminPageHeader title="Manage Orders" />

        <AdminContentSearch title={true} />

        <div className="divider w-full" />

        {!products && (
          <p className="text-sm text-brand-black/50 px-3">no items found.</p>
        )}

        {products && products.length > 0 && (
          <BasicTable
            onRowClick={(itemId) =>
              navigate(`/admin/upsert/dropship-product?contentId=${itemId}`)
            }
            currentPage={currentPage}
            objectArray={products?.map((e: AliExpressHubSearch_Result) => ({
              id: e.item.itemId,
              title: e.item.title,
              price: e.item.price?.pc,
            }))}
          />
        )}

        {totalPages && <Pagination totalPages={totalPages} />}
      </Form>
      <Outlet />
    </AdminPageWrapper>
  );
};

export default DropshipSearch;
