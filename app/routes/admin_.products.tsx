import Pagination from "~/components/Pagination";
import { getBrands } from "~/models/brands.server";
import {
  type ProductWithDetails,
  searchProducts,
} from "~/models/products.server";
import ProductSort from "~/components/Sorting/ProductSort";
import { redirect, type LoaderFunctionArgs, json } from "@remix-run/node";
import AdminPageHeader from "~/components/Layout/_Admin/AdminPageHeader";
import AdminPageWrapper from "~/components/Layout/_Admin/AdminPageWrapper";
import { getProductSubCategories } from "~/models/productSubCategories.server";
import { Form, Outlet, useLoaderData, useSearchParams } from "@remix-run/react";
import { tokenAuth } from "~/auth.server";
import { STAFF_SESSION_KEY } from "~/session.server";
import BasicTable from "~/components/Tables/BasicTable";
import AdminContentSearch from "~/components/Search/AdminContentSearch";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const authenticated = await tokenAuth(request, STAFF_SESSION_KEY);

  if (!authenticated.valid) {
    return redirect("/admin/login");
  }

  const url = new URL(request.url);

  const { products, totalPages } = await searchProducts(undefined, url);
  const brands = await getBrands();
  const productSubCategories = await getProductSubCategories();

  return json({
    products,
    brands,
    productSubCategories,
    totalPages,
  });
};

const ManageProducts = () => {
  const { products, totalPages, productSubCategories, brands } =
    useLoaderData<typeof loader>();

  const [searchParams] = useSearchParams();

  const currentPage = Number(searchParams.get("pageNumber")) || 1;

  return (
    <AdminPageWrapper>
      <Form method="GET" className="relative h-full w-full bg-base-200 p-6">
        <AdminPageHeader title="Manage Products" addButtonText="Add Products" />

        <AdminContentSearch
          name={true}
          brands={brands}
          productSubCategories={productSubCategories}
        />

        <div className="divider w-full" />

        <ProductSort />

        {products && products.length > 0 && (
          <BasicTable
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

export default ManageProducts;
