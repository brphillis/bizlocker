import type { Promotion } from "@prisma/client";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Outlet, useLoaderData, useSearchParams } from "@remix-run/react";
import { tokenAuth } from "~/auth.server";
import BasicInput from "~/components/Forms/Input/BasicInput";
import AdminPageHeader from "~/components/Layout/_Admin/AdminPageHeader";
import AdminPageWrapper from "~/components/Layout/_Admin/AdminPageWrapper";
import Pagination from "~/components/Pagination";
import BasicTable from "~/components/Tables/BasicTable";
import { searchPromotions } from "~/models/promotions.server";
import { STAFF_SESSION_KEY } from "~/session.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const authenticated = await tokenAuth(request, STAFF_SESSION_KEY);

  if (!authenticated.valid) {
    return redirect("/admin/login");
  }

  const url = new URL(request.url);

  const { promotions, totalPages } = await searchPromotions(undefined, url);

  return json({ promotions, totalPages });
};

const Promotions = () => {
  const { promotions, totalPages } = useLoaderData<typeof loader>();

  const [searchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("pageNumber")) || 1;

  return (
    <AdminPageWrapper>
      <Form method="GET" className="relative h-full w-full bg-base-200 p-6">
        <AdminPageHeader
          title="Manage Promotions"
          addButtonText="Add Promotion"
        />

        <div className="mt-3 flex flex-col">
          <BasicInput name="name" label="Name" placeholder="Name" type="text" />

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

        {promotions && promotions.length > 0 && (
          <BasicTable
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

export default Promotions;
