import Pagination from "~/components/Pagination";
import {
  type LoaderFunctionArgs,
  json,
  redirect,
} from "@remix-run/server-runtime";
import { searchBrands, type BrandWithContent } from "~/models/brands.server";
import BasicInput from "~/components/Forms/Input/BasicInput";
import AdminPageHeader from "~/components/Layout/_Admin/AdminPageHeader";
import AdminPageWrapper from "~/components/Layout/_Admin/AdminPageWrapper";
import { Form, Outlet, useLoaderData, useSearchParams } from "@remix-run/react";
import { tokenAuth } from "~/auth.server";
import { STAFF_SESSION_KEY } from "~/session.server";
import BasicTable from "~/components/Tables/BasicTable";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const authenticated = await tokenAuth(request, STAFF_SESSION_KEY);

  if (!authenticated.valid) {
    return redirect("/login");
  }

  const url = new URL(request.url);

  const { brands, totalPages } = await searchBrands(undefined, url);

  return json({ brands, totalPages });
};

const Brands = () => {
  const { brands, totalPages } = useLoaderData<typeof loader>();

  const [searchParams] = useSearchParams();

  const currentPage = Number(searchParams.get("pageNumber")) || 1;

  return (
    <AdminPageWrapper>
      <Form method="GET" className="relative h-full w-full bg-base-200 p-6">
        <AdminPageHeader title="Manage Brands" addButtonText="Add Brands" />

        <div className="mt-3 flex flex-col">
          <div className="flex flex-row">
            <BasicInput
              label="Brand Name"
              name="name"
              placeholder="Name"
              type="text"
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

        {brands && brands.length > 0 && (
          <BasicTable
            currentPage={currentPage}
            objectArray={brands.map((e: BrandWithContent) => ({
              id: e.id,
              name: e.name,
            }))}
          />
        )}

        <Pagination totalPages={totalPages} />
      </Form>
      <Outlet />
    </AdminPageWrapper>
  );
};

export default Brands;
