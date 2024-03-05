import Pagination from "~/components/Pagination";
import { ProductCategory } from "@prisma/client";
import BasicTable from "~/components/Tables/BasicTable";
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
import { productCategorySearchLoader } from "./index.server";

const ProductCategorySearch = () => {
  const { productCategories, totalPages, productSubCategories, departments } =
    useLoaderData<typeof productCategorySearchLoader>();

  const navigate = useNavigate();

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
          buttonLabel="Add Categories"
          buttonLink="/admin/upsert/product-category?contentId=add"
        />

        <AdminContentSearch
          name={true}
          departments={departments}
          productSubCategories={productSubCategories}
        />

        <div className="divider w-full" />

        <CategorySort />

        {productCategories && productCategories.length > 0 && (
          <BasicTable
            onRowClick={(id) =>
              navigate(`/admin/upsert/product-category?contentId=${id}`)
            }
            currentPage={currentPage}
            objectArray={productCategories?.map((e: ProductCategory) => ({
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
};

export default ProductCategorySearch;
