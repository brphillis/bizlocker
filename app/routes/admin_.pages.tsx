import type { WebPage } from "@prisma/client";
import { redirect, type LoaderFunctionArgs, json } from "@remix-run/node";
import {
  Form,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from "@remix-run/react";
import { tokenAuth } from "~/auth.server";
import BasicInput from "~/components/Forms/Input/BasicInput";
import AdminPageHeader from "~/components/Layout/_Admin/AdminPageHeader";
import AdminPageWrapper from "~/components/Layout/_Admin/AdminPageWrapper";
import Pagination from "~/components/Pagination";
import BasicTable from "~/components/Tables/BasicTable";
import { searchWebPages } from "~/models/webPages.server";
import { STAFF_SESSION_KEY } from "~/session.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const authenticated = await tokenAuth(request, STAFF_SESSION_KEY);

  if (!authenticated.valid) {
    return redirect("/admin/login");
  }

  const url = new URL(request.url);

  const { webPages, totalPages } = await searchWebPages(undefined, url);

  return json({ webPages, totalPages });
};

const Pages = () => {
  const navigate = useNavigate();
  const { webPages, totalPages } = useLoaderData<typeof loader>();

  const [searchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("pageNumber")) || 1;

  return (
    <AdminPageWrapper>
      <Form method="GET" className="relative h-full w-full bg-base-200 p-6">
        <AdminPageHeader
          title="Manage Pages"
          addButtonText="Add Page"
          createLink="/admin/pagebuilder/new?req=webpage"
        />

        <div className="mt-3 flex flex-col">
          <div className="flex flex-row flex-wrap gap-6">
            <BasicInput
              label="Page Title"
              name="title"
              placeholder="Title"
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

        {webPages && webPages.length > 0 && (
          <BasicTable
            onRowClick={(e) => navigate(`/admin/pagebuilder/webpage?id=${e}`)}
            currentPage={currentPage}
            objectArray={webPages?.map((e: WebPage) => ({
              id: e.id,
              title: e.title,
              active: e.isActive,
            }))}
          />
        )}

        <Pagination totalPages={totalPages} />
      </Form>
    </AdminPageWrapper>
  );
};

export default Pages;
