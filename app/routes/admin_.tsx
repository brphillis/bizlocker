import {
  json,
  type MetaFunction,
  type LoaderFunctionArgs,
} from "@remix-run/node";
import { useEffect } from "react";
import { STAFF_SESSION_KEY, getUserDataFromSession } from "~/session.server";
import { useLoaderData, useLocation, useNavigate } from "@remix-run/react";
import AdminSideBar from "~/components/Layout/_Admin/Navigation/SideBar";
import { type StaffWithDetails } from "~/models/staff.server";
import {
  getStaffNotifications,
  getStoreNotifications,
} from "~/models/notifications.server";

import "../../node_modules/swiper/swiper.min.css";
import "../../node_modules/swiper/modules/navigation.min.css";
import "sweetalert2/dist/sweetalert2.css";

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
  const staffMember = (await getUserDataFromSession(
    request,
    STAFF_SESSION_KEY
  )) as StaffWithDetails;

  let userNotifications = [];

  const storeNotifications =
    staffMember?.storeId &&
    (await getStoreNotifications(staffMember?.storeId?.toString()));

  if (storeNotifications) {
    userNotifications.push(...storeNotifications);
  }

  const staffNotifications = await getStaffNotifications(
    staffMember?.id.toString()
  );

  if (staffNotifications) {
    userNotifications.push(...staffNotifications);
  }

  return json({ staffMember, userNotifications });
};

const Admin = () => {
  const { staffMember, userNotifications } = useLoaderData<typeof loader>();

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

export default Admin;
