import {
  json,
  type MetaFunction,
  type LoaderFunctionArgs,
} from "@remix-run/node";
import { useEffect } from "react";
import { STAFF_SESSION_KEY, getUserDataFromSession } from "~/session.server";
import { useLoaderData, useLocation, useNavigate } from "@remix-run/react";
import AdminSideBar from "~/components/Layout/_Admin/Navigation/SideBar";
import { type StaffWithDetails } from "~/models/auth/staff.server";

export const meta: MetaFunction = ({ data }) => {
  return [
    { title: "CLUTCH | Admin Portal" },
    {
      name: "CLUTCH | Admin Portal",
      content: "CLUTCH | Admin Portal",
    },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const staffMember = await getUserDataFromSession(request, STAFF_SESSION_KEY);
  return json({ staffMember });
};

const Admin = () => {
  const { staffMember } = useLoaderData<typeof loader>();

  const navigate = useNavigate();
  const location = useLocation();
  const isLoginPage: boolean = location.pathname === "/admin/login";

  useEffect(() => {
    if (!staffMember && !isLoginPage) {
      navigate("/admin/login");
    }
  }, [isLoginPage, staffMember, navigate]);

  return <AdminSideBar {...(staffMember as StaffWithDetails)} />;
};

export default Admin;
