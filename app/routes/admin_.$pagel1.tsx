import { Outlet, useParams } from "@remix-run/react";
import { type ActionFunctionArgs } from "@remix-run/server-runtime";
import AdminLogin from "~/modules/Admin/Login";
import { adminLoginAction } from "~/modules/Admin/Login/index.server";
import { adminHomeLoader } from "~/modules/Admin/Home/index.server";
import AdminHome from "~/modules/Admin/Home";

export const loader = async ({ request, params }: ActionFunctionArgs) => {
  const page = params?.pagel1;

  switch (page) {
    case "home":
      return await adminHomeLoader(request, params);
    default:
      return null;
  }
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const page = params?.pagel1;

  switch (page) {
    case "login":
      return await adminLoginAction(request, params);
  }
};

const PageL1 = () => {
  const { pagel1 } = useParams();
  let activeModule;
  let useOutlet = true;

  switch (pagel1) {
    case "home":
      activeModule = <AdminHome />;
      break;
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
