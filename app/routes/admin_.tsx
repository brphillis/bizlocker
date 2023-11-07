import type { LoaderArgs } from "@remix-run/server-runtime";
import { useEffect } from "react";
import { STAFF_SESSION_KEY, getUserDataFromSession } from "~/session.server";
import { useLoaderData, useLocation, useNavigate } from "@remix-run/react";
import AdminSideBar from "~/components/Layout/_Admin/Navigation/SideBar";

export const loader = async ({ request }: LoaderArgs) => {
  const staffMember = await getUserDataFromSession(request, STAFF_SESSION_KEY);
  return { staffMember };
};

const Admin = () => {
  const { staffMember } = useLoaderData();
  const navigate = useNavigate();
  const location = useLocation();
  const isLoginPage = location.pathname === "/admin/login";

  useEffect(() => {
    if (!staffMember && !isLoginPage) {
      navigate("/admin/login");
    }
  }, [isLoginPage, staffMember, navigate]);

  return <AdminSideBar user={staffMember} />;
};

export default Admin;
