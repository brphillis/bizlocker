import { useEffect } from "react";
import type { LoaderArgs } from "@remix-run/server-runtime";
import { getUserObject } from "~/session.server";
import {
  Outlet,
  useLoaderData,
  useLocation,
  useNavigate,
  useNavigation,
  useSubmit,
} from "@remix-run/react";
import {
  IoFileTrayFull,
  IoFolder,
  IoMegaphone,
  IoMenu,
  IoPeople,
  IoPlanet,
  IoPricetag,
} from "react-icons/io5";
import DarkOverlay from "~/components/Layout/DarkOverlay";
import Spinner from "~/components/Spinner";

export const loader = async ({ request }: LoaderArgs) => {
  const user = await getUserObject(request);
  return { user };
};

const Admin = () => {
  const { user } = useLoaderData();
  const submit = useSubmit();
  const navigate = useNavigate();
  const navigation = useNavigation();
  const location = useLocation();
  const isLoginPage = location.pathname === "/admin/login";

  const LogoutButton = (style?: string) => {
    return (
      <button
        className={"btn-primary btn-md " + style}
        onClick={() => submit(null, { method: "post", action: "/logout" })}
      >
        Log Out
      </button>
    );
  };

  useEffect(() => {
    if (!user && !isLoginPage) {
      navigate("/admin/login");
    }
  }, [isLoginPage, user, navigate]);

  return (
    <div
      data-theme="light-theme"
      className="drawer min-h-screen lg:drawer-open"
    >
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content relative flex min-h-[calc(100vh-60px)] flex-col items-center justify-start overflow-x-hidden">
        <div className="flex h-[60px] w-full flex-row items-center gap-6 self-start justify-self-start bg-brand-black p-3 lg:hidden">
          <label
            htmlFor="my-drawer-2"
            className="btn btn-square btn-ghost text-brand-white/50"
          >
            <IoMenu size={26} />
          </label>
          <h1
            className="select-none text-center text-2xl font-bold tracking-wide text-white/90"
            onClick={() => navigate("/admin")}
          >
            CLUTCH.
          </h1>
        </div>

        {location.state === ("loading" || "submitting") && (
          <DarkOverlay fadeIn={true}>
            <div>LOADING...</div>
          </DarkOverlay>
        )}

        {navigation.state === ("loading" || "submitting") && (
          <DarkOverlay>
            <Spinner mode="circle" extendStyle={"mt-16"} />
          </DarkOverlay>
        )}

        <Outlet />
      </div>

      {user && (
        <div className="drawer-side z-50 min-h-screen">
          <label
            htmlFor="my-drawer-2"
            className="drawer-overlay !min-h-screen"
          ></label>
          <ul className="scrollbar-hide menu h-max min-h-full w-80 overflow-y-scroll bg-brand-black p-4 text-brand-white">
            <h1 className="select-none pt-3 text-center text-2xl font-bold tracking-wide text-white/90">
              CLUTCH.
            </h1>
            <p className="pt-3 text-center text-[12px]">
              Welcome, {user?.email}
            </p>
            <div className="divider w-full" />

            <details className="collapse">
              <summary className="text-md collapse-title -mb-3 !pb-0 font-medium tracking-wide text-primary-content">
                <div className="flex items-center gap-3">
                  <IoPeople size={18} />
                  <p className="transition duration-500 ease-in-out hover:scale-[1.03]">
                    User Management
                  </p>
                </div>
              </summary>
              <div className="collapse-content">
                <ul className="text-white/75">
                  <li onClick={() => navigate("/admin/users")}>
                    <label htmlFor="my-drawer-2" className="hover:text-white">
                      Users
                    </label>
                  </li>

                  <li onClick={() => navigate("/admin/orders")}>
                    <label htmlFor="my-drawer-2" className="hover:text-white">
                      Orders
                    </label>
                  </li>
                </ul>
              </div>
            </details>

            <details className="collapse">
              <summary className="text-md collapse-title -mb-3 !pb-0 font-medium tracking-wide text-primary-content">
                <div className="flex items-center gap-3">
                  <IoPlanet size={18} />
                  <p className="transition duration-500 ease-in-out hover:scale-[1.03]">
                    Website
                  </p>
                </div>
              </summary>
              <div className="collapse-content">
                <ul className="text-white/75">
                  <li onClick={() => navigate("/admin/home-page")}>
                    <label htmlFor="my-drawer-2" className="hover:text-white">
                      Home Page
                    </label>
                  </li>
                  <li onClick={() => navigate("/admin/pages")}>
                    <label htmlFor="my-drawer-2" className="hover:text-white">
                      Pages
                    </label>
                  </li>
                  <li onClick={() => navigate("/admin/articles")}>
                    <label htmlFor="my-drawer-2" className="hover:text-white">
                      Articles
                    </label>
                  </li>
                  <li onClick={() => navigate("/admin/article-categories")}>
                    <label htmlFor="my-drawer-2" className="hover:text-white">
                      Article Categories
                    </label>
                  </li>
                </ul>
              </div>
            </details>

            <details className="collapse">
              <summary className="text-md collapse-title -mb-3 !pb-0 font-medium tracking-wide text-primary-content">
                <div className="flex items-center gap-3">
                  <IoPricetag size={18} />
                  <p className="transition duration-500 ease-in-out hover:scale-[1.03]">
                    Product
                  </p>
                </div>
              </summary>
              <div className="collapse-content">
                <ul className="text-white/75">
                  <li onClick={() => navigate("/admin/products")}>
                    <label htmlFor="my-drawer-2" className="hover:text-white">
                      Products
                    </label>
                  </li>
                  <li onClick={() => navigate("/admin/departments")}>
                    <label htmlFor="my-drawer-2" className="hover:text-white">
                      Departments
                    </label>
                  </li>
                  <li onClick={() => navigate("/admin/product-categories")}>
                    <label htmlFor="my-drawer-2" className="hover:text-white">
                      Categories
                    </label>
                  </li>
                  <li onClick={() => navigate("/admin/product-subcategories")}>
                    <label htmlFor="my-drawer-2" className="hover:text-white">
                      SubCategories
                    </label>
                  </li>
                  <li onClick={() => navigate("/admin/brands")}>
                    <label htmlFor="my-drawer-2" className="hover:text-white">
                      Brands
                    </label>
                  </li>
                </ul>
              </div>
            </details>

            <details className="collapse">
              <summary className="text-md collapse-title -mb-3 !pb-0 font-medium tracking-wide text-primary-content">
                <div className="flex items-center gap-3">
                  <IoFolder size={18} />
                  <p className="transition duration-500 ease-in-out hover:scale-[1.03]">
                    Storage
                  </p>
                </div>
              </summary>
              <div className="collapse-content">
                <ul className="text-white/75">
                  <li onClick={() => navigate("/admin/images")}>
                    <label htmlFor="my-drawer-2" className="hover:text-white">
                      Images
                    </label>
                  </li>
                </ul>
              </div>
            </details>

            <details className="collapse">
              <summary className="text-md collapse-title -mb-3 !pb-0 font-medium tracking-wide text-primary-content">
                <div className="flex items-center gap-3">
                  <IoFileTrayFull size={18} />
                  <p className="transition duration-500 ease-in-out hover:scale-[1.03]">
                    Reports
                  </p>
                </div>
              </summary>
              <div className="collapse-content">
                <ul className="text-white/75">
                  <li onClick={() => navigate("/admin/report-sales")}>
                    <label htmlFor="my-drawer-2" className="hover:text-white">
                      Sales
                    </label>
                  </li>
                </ul>
              </div>
            </details>

            <details className="collapse">
              <summary className="text-md collapse-title -mb-3 !pb-0 font-medium tracking-wide text-primary-content">
                <div className="flex items-center gap-3">
                  <IoMegaphone size={18} />
                  <p className="transition duration-500 ease-in-out hover:scale-[1.03]">
                    Marketing
                  </p>
                </div>
              </summary>
              <div className="collapse-content">
                <ul className="text-white/75">
                  <li onClick={() => navigate("/admin/promotions")}>
                    <label htmlFor="my-drawer-2" className="hover:text-white">
                      Promotions
                    </label>
                  </li>
                  <li onClick={() => navigate("/admin/campaigns")}>
                    <label htmlFor="my-drawer-2" className="hover:text-white">
                      Campaigns
                    </label>
                  </li>
                </ul>
              </div>
            </details>

            <div className="absolute bottom-3 right-3">
              {user && <>{LogoutButton()}</>}
            </div>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Admin;
