import Pagination from "~/components/Pagination";
import {
  type LoaderFunctionArgs,
  json,
  redirect,
} from "@remix-run/server-runtime";
import { searchBrands, type BrandWithContent } from "~/models/brands.server";
import AdminPageHeader from "~/components/Layout/_Admin/AdminPageHeader";
import AdminPageWrapper from "~/components/Layout/_Admin/AdminPageWrapper";
import {
  Form,
  Outlet,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from "@remix-run/react";
import { tokenAuth } from "~/auth.server";
import { STAFF_SESSION_KEY } from "~/session.server";
import BasicTable from "~/components/Tables/BasicTable";
import AdminContentSearch from "~/components/Search/AdminContentSearch";

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

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const currentPage = Number(searchParams.get("pageNumber")) || 1;

  return (
    <AdminPageWrapper>
      <Form method="GET" className="relative h-full w-full bg-base-200 p-6">
        <AdminPageHeader
          title="Manage Brands"
          buttonLabel="Add Brand"
          buttonLink="/admin/upsert/brand?contentId=add"
        />

        <AdminContentSearch name={true} />

        <div className="divider w-full" />

        {brands && brands.length > 0 && (
          <BasicTable
            onRowClick={(id) => navigate(`/admin/upsert/brand?contentId=${id}`)}
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
