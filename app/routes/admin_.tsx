import type { LoaderArgs } from "@remix-run/server-runtime";
import { useEffect } from "react";
import { getUserDataFromSession } from "~/session.server";
import { useLoaderData, useLocation, useNavigate } from "@remix-run/react";
import AdminSideBar from "~/components/Layout/_Admin/Navigation/SideBar";

export const loader = async ({ request }: LoaderArgs) => {
  const user = await getUserDataFromSession(request);
  return { user };
};

const Admin = () => {
  const { user } = useLoaderData();
  const navigate = useNavigate();
  const location = useLocation();
  const isLoginPage = location.pathname === "/admin/login";

  useEffect(() => {
    if (!user && !isLoginPage) {
      navigate("/admin/login");
    }
  }, [isLoginPage, user, navigate]);

  return <AdminSideBar user={user} />;
};

export default Admin;
