import Pagination from "~/components/Pagination";
import BasicTable from "~/components/Tables/BasicTable";
import ProductSort from "~/components/Sorting/ProductSort";
import { ProductWithDetails } from "~/models/Products/types";
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
import { productSearchLoader } from "./index.server";

const ProductSearch = () => {
  const { products, totalPages, productSubCategories, brands } =
    useLoaderData<typeof productSearchLoader>();

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const currentPage = Number(searchParams.get("pageNumber")) || 1;

  return (
    <AdminPageWrapper>
      <Form method="GET" className="relative h-full w-full bg-base-200 p-6">
        <AdminPageHeader
          title="Manage Products"
          buttonLabel="Add Product"
          buttonLink="/admin/upsert/product?contentId=add"
        />

        <AdminContentSearch
          name={true}
          brands={brands}
          productSubCategories={productSubCategories}
        />

        <div className="divider w-full" />

        <ProductSort />

        {products && products.length > 0 && (
          <BasicTable
            onRowClick={(id) =>
              navigate(`/admin/upsert/product?contentId=${id}`)
            }
            currentPage={currentPage}
            objectArray={products.map((e: ProductWithDetails) => ({
              id: e.id,
              name: e.name,
              category: e?.productSubCategories?.[0].name,
              brand: e.brand?.name,
              sold: e.totalSold,
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

export default ProductSearch;
