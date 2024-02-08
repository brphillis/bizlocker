import { useEffect } from "react";
import { StaffWithDetails } from "~/models/Staff/types";
import AdminSideBar from "~/components/Layout/_Admin/Navigation/SideBar";
import { useLoaderData, useLocation, useNavigate } from "@remix-run/react";
import { adminRootLoader } from "./index.server";

import "sweetalert2/dist/sweetalert2.css";

import "../../../../node_modules/swiper/swiper.min.css";
import "../../../../node_modules/swiper/modules/navigation.min.css";

const AdminRoot = () => {
  const { staffMember, userNotifications } =
    useLoaderData<typeof adminRootLoader>();

  const navigate = useNavigate();
  const location = useLocation();
  const isLoginPage: boolean = location.pathname === "/admin/login";

  useEffect(() => {
    if (!staffMember && !isLoginPage) {
      navigate("/admin/login");
    }
  }, [isLoginPage, staffMember, navigate]);

  return (
    <AdminSideBar
      staffMember={staffMember as StaffWithDetails}
      userNotifications={userNotifications}
    />
  );
};

export default AdminRoot;
