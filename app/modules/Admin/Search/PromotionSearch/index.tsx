import type { Promotion } from "@prisma/client";
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
import type { promotionSearchLoader } from "./index.server";

const PromotionSearch = () => {
  const { promotions, totalPages } =
    useLoaderData<typeof promotionSearchLoader>();

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("pageNumber")) || 1;

  return (
    <AdminPageWrapper>
      <Form method="GET" className="relative h-full w-full bg-base-200 p-6">
        <AdminPageHeader
          title="Manage Promotions"
          buttonLabel="Add Promotion"
          buttonLink="/admin/upsert/promotion?contentId=add"
        />

        <AdminContentSearch name={true} />

        <div className="divider w-full" />

        {promotions && promotions.length > 0 && (
          <BasicTable
            onRowClick={(id) =>
              navigate(`/admin/upsert/promotion?contentId=${id}`)
            }
            currentPage={currentPage}
            objectArray={promotions?.map((e: Promotion) => ({
              id: e.id,
              name: e.name,
              discount: e.discountPercentage,
              active: e.isActive,
            }))}
          />
        )}

        <Pagination totalPages={totalPages} />
      </Form>
      <Outlet />
    </AdminPageWrapper>
  );
};

export default PromotionSearch;
