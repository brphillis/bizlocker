import { MetaFunction } from "@remix-run/node";
import { Outlet, useParams } from "@remix-run/react";
import { type ActionFunctionArgs } from "@remix-run/server-runtime";
import AdminLogin from "~/modules/Admin/Login";
import { adminLoginAction } from "~/modules/Admin/Login/index.server";

export const meta: MetaFunction = () => {
  return [
    { title: "CLUTCH | Admin Portal" },
    {
      name: "description",
      content: "Clutch Clothing Administration Portal",
    },
  ];
};

export const loader = async ({ params }: ActionFunctionArgs) => {
  const page = params?.pagel1;

  switch (page) {
    default:
      return null;
  }
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const page = params?.pagel1;

  switch (page) {
    case "login":
      return await adminLoginAction(request);
  }
};

const PageL1 = () => {
  const { pagel1 } = useParams();
  let activeModule;
  const useOutlet = true;

  switch (pagel1) {
    case "login":
      activeModule = <AdminLogin />;
      break;
  }

  return (
    <>
      {activeModule}
      {useOutlet && <Outlet />}
    </>
  );
};

export default PageL1;
