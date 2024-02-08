import Pagination from "~/components/Pagination";
import BasicTable from "~/components/Tables/BasicTable";
import { type ProductSubCategory } from "@prisma/client";
import CategorySort from "~/components/Sorting/CategorySort";
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
import type { productSubCategorySearchLoader } from "./index.server";

export default function ProductSubCategorySearch() {
  const { productSubCategories, productCategories, totalPages } =
    useLoaderData<typeof productSubCategorySearchLoader>();

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("pageNumber")) || 1;

  return (
    <AdminPageWrapper>
      <Form method="GET" className="relative h-full w-full bg-base-200 p-6">
        <AdminPageHeader
          title="Manage Sub Categories"
          buttonLabel="Add Sub Category"
          buttonLink="/admin/upsert/product-subcategory?contentId=add"
        />

        <AdminContentSearch name={true} productCategories={productCategories} />

        <div className="divider w-full" />

        <CategorySort />

        {productSubCategories && productSubCategories.length > 0 && (
          <BasicTable
            onRowClick={(id) =>
              navigate(`/admin/upsert/productSubCategory?contentId=${id}`)
            }
            currentPage={currentPage}
            objectArray={productSubCategories?.map((e: ProductSubCategory) => ({
              id: e.id,
              name: e.name,
              index: e.index,
              navigation: e.displayInNavigation,
              active: e.isActive,
            }))}
          />
        )}

        <Pagination totalPages={totalPages} />
      </Form>
      <Outlet />
    </AdminPageWrapper>
  );
}
