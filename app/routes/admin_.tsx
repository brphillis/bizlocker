import { useEffect } from "react";
import {
  Outlet,
  useLocation,
  useNavigate,
  useRouteLoaderData,
  useSubmit,
} from "@remix-run/react";
import { IoMenu } from "react-icons/io5";

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

  const LoginButton = (style?: string) => {
    return (
      <button
        className={"btn-primary btn-md " + style}
        onClick={() => navigate("/login")}
      >
        Login
      </button>
    );
  };

  useEffect(() => {
    if (!user && !isLoginPage) {
      navigate("/admin/login");
    }
  }, [isLoginPage, user, navigate]);

  return (
    <div className="drawer !max-h-[calc(100vh+64px)] lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col items-center justify-start">
        <div className="flex h-[64px] w-screen flex-row items-center gap-6 bg-base-300 p-3 lg:hidden">
          <label htmlFor="my-drawer-2" className="btn-ghost btn-square btn">
            <IoMenu size={26} />
          </label>
          <h1 className="select-none text-center text-2xl font-bold tracking-wide text-white/90">
            CLUTCH.
          </h1>
        </div>
        <Outlet />
      </div>
      <div className="drawer-side">
        <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
        <ul className="menu h-full w-80 bg-base-200 p-4 text-base-content">
          <h1 className="select-none pt-3 text-center text-2xl font-bold tracking-wide text-white/90">
            CLUTCH.
          </h1>
          <p className="pt-3 text-center text-[12px]">Welcome, {user?.email}</p>
          <div className="divider w-full" />

          <details className="collapse">
            <summary className="text-md collapse-title -mb-3 !pb-0 font-medium tracking-wide text-primary-content">
              User Management
            </summary>
            <div className="collapse-content">
              <ul>
                <li onClick={() => navigate("/admin/users")}>
                  <div>
                    <span>Users</span>
                  </div>
                </li>

                <li onClick={() => navigate("/admin/orders")}>
                  <div>
                    <span>Orders</span>
                  </div>
                </li>
              </ul>
            </div>
          </details>

          <details className="collapse">
            <summary className="text-md collapse-title -mb-3 !pb-0 font-medium tracking-wide text-primary-content">
              Website
            </summary>
            <div className="collapse-content">
              <ul>
                <li onClick={() => navigate("/admin/root-categories")}>
                  <div>
                    <span>Root Categories</span>
                  </div>
                </li>
                <li onClick={() => navigate("/admin/articles")}>
                  <div>
                    <span>Articles</span>
                  </div>
                </li>
                <li onClick={() => navigate("/admin/article-categories")}>
                  <div>
                    <span>Article Categories</span>
                  </div>
                </li>
              </ul>
            </div>
          </details>

          <details className="collapse">
            <summary className="text-md collapse-title -mb-3 !pb-0 font-medium tracking-wide text-primary-content">
              Product
            </summary>
            <div className="collapse-content">
              <ul>
                <li onClick={() => navigate("/admin/products")}>
                  <div>
                    <span>Products</span>
                  </div>
                </li>
                <li onClick={() => navigate("/admin/product-categories")}>
                  <div>
                    <span>Product Categories</span>
                  </div>
                </li>
                <li onClick={() => navigate("/admin/brands")}>
                  <div>
                    <span>Brands</span>
                  </div>
                </li>
              </ul>
            </div>
          </details>

          <details className="collapse">
            <summary className="text-md collapse-title -mb-3 !pb-0 font-medium tracking-wide text-primary-content">
              Marketing
            </summary>
            <div className="collapse-content">
              <ul>
                <li onClick={() => navigate("/admin/promotions")}>
                  <div>
                    <span>Promotions</span>
                  </div>
                </li>
                <li onClick={() => navigate("/admin/campaigns")}>
                  <div>
                    <span>Campaigns</span>
                  </div>
                </li>
              </ul>
            </div>
          </details>

          <div className="absolute bottom-3 right-3">
            {user && <>{LogoutButton()}</>}
            {!user && <>{LoginButton()}</>}
          </div>
        </ul>
      </div>
    </div>
  );
};

export default Admin;
