import { useEffect } from "react";
import {
  Outlet,
  useLocation,
  useNavigate,
  useRouteLoaderData,
  useSubmit,
} from "@remix-run/react";
import {
  IoFileTrayFull,
  IoMegaphone,
  IoMenu,
  IoPeople,
  IoPlanet,
  IoPricetag,
} from "react-icons/io5";

const Admin = () => {
  const user = useRouteLoaderData("root") as User | undefined;
  const submit = useSubmit();
  const navigate = useNavigate();
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

  // const LoginButton = (style?: string) => {
  //   return (
  //     <button
  //       className={"btn-primary btn-md " + style}
  //       onClick={() => navigate("/login")}
  //     >
  //       Login
  //     </button>
  //   );
  // };

  useEffect(() => {
    if (!user && !isLoginPage) {
      navigate("/admin/login");
    }
  }, [isLoginPage, user, navigate]);

  return (
    <div
      data-theme="light-theme"
      className="max-w-screen drawer min-h-screen lg:drawer-open"
    >
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="max-w-screen drawer-content flex min-h-screen w-full flex-col items-center justify-start">
        <div className="flex h-[64px] w-screen flex-row items-center gap-6 self-start justify-self-start bg-brand-black p-3 lg:hidden">
          <label htmlFor="my-drawer-2" className="btn-ghost btn-square btn">
            <IoMenu size={26} />
          </label>
          <h1 className="select-none text-center text-2xl font-bold tracking-wide text-white/90">
            CLUTCH.
          </h1>
        </div>
        <Outlet />
      </div>

      {user && (
        <div className="drawer-side min-h-screen">
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
                <ul>
                  <li onClick={() => navigate("/admin/users")}>
                    <div className="hover:text-white">Users</div>
                  </li>

                  <li onClick={() => navigate("/admin/orders")}>
                    <div className="hover:text-white">Orders</div>
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
                <ul>
                  <li onClick={() => navigate("/admin/home-page")}>
                    <div className="hover:text-white">Home Page</div>
                  </li>
                  <li onClick={() => navigate("/admin/root-categories")}>
                    <div className="hover:text-white">Root Categories</div>
                  </li>
                  <li onClick={() => navigate("/admin/articles")}>
                    <div className="hover:text-white">Articles</div>
                  </li>
                  <li onClick={() => navigate("/admin/article-categories")}>
                    <div className="hover:text-white">Article Categories</div>
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
                <ul>
                  <li onClick={() => navigate("/admin/products")}>
                    <div className="hover:text-white">Products</div>
                  </li>
                  <li onClick={() => navigate("/admin/product-categories")}>
                    <div className="hover:text-white">Product Categories</div>
                  </li>
                  <li onClick={() => navigate("/admin/brands")}>
                    <div className="hover:text-white">Brands</div>
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
                <ul>
                  <li onClick={() => navigate("/admin/report-sales")}>
                    <div className="hover:text-white">Sales</div>
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
                <ul>
                  <li onClick={() => navigate("/admin/promotions")}>
                    <div className="hover:text-white">Promotions</div>
                  </li>
                  <li onClick={() => navigate("/admin/campaigns")}>
                    <div className="hover:text-white">Campaigns</div>
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
