import type { LoaderArgs } from "@remix-run/node";
import { Form, Outlet } from "@remix-run/react";
import AdminPageHeader from "~/components/Layout/AdminPageHeader";
import AdminPageWrapper from "~/components/Layout/AdminPageWrapper";

// export const loader = async ({ request }: LoaderArgs) => {};

const ManageHomePage = () => {
  return (
    <AdminPageWrapper>
      <Form method="GET" className="relative h-full w-full bg-base-300 p-6">
        <AdminPageHeader title="Manage Home Page" />
      </Form>
      <Outlet />
    </AdminPageWrapper>
  );
};

export default ManageHomePage;
