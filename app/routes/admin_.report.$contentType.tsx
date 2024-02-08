import { useParams } from "@remix-run/react";
import { redirect, type ActionFunctionArgs } from "@remix-run/server-runtime";
import { tokenAuth } from "~/auth.server";
import { STAFF_SESSION_KEY } from "~/session.server";
import SalesReporting from "~/modules/Admin/Report/SalesReport";
import { salesReportLoader } from "~/modules/Admin/Report/SalesReport/index.server";
import { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "CLUTCH | Admin Portal" },
    {
      name: "description",
      content: "Clutch Clothing Administration Portal",
    },
  ];
};

export const loader = async ({ request, params }: ActionFunctionArgs) => {
  const authenticated = await tokenAuth(request, STAFF_SESSION_KEY);

  if (!authenticated.valid) {
    return redirect("/admin/login");
  }

  const contentType = params?.contentType;

  switch (contentType) {
    case "sales":
      return await salesReportLoader();
  }
};

const Report = () => {
  const { contentType } = useParams();
  return <>{contentType === "sales" && <SalesReporting />}</>;
};

export default Report;
