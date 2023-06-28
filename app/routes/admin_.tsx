import { useEffect } from "react";
import { IoHomeSharp } from "react-icons/io5";
import {
  Outlet,
  useLocation,
  useNavigate,
  useRouteLoaderData,
  useSubmit,
} from "@remix-run/react";

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
        LogOut
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

  //   const adminRoutes: Route[] = Routes.reduce(
  //     (results: Route[], { id, children }: Route) => {
  //       if (id === "admin-root" && children) {
  //         return results.concat(children);
  //       }
  //       return results;
  //     },
  //     []
  //   );

  //   const renderRoutes = (routes: Route[]) => {
  //     return routes.map(({ id, title, path, icon }: Route) => {
  //       if (title !== "login" && !title?.includes("home")) {
  //         const Icon = icon as IconType;
  //         return (
  //           <li key={id + path} onClick={() => navigate(path)}>
  //             <div>
  //               {Icon && <Icon className="h-6 w-auto text-primary-content" />}
  //               <span>{capitalizeFirst(title)}</span>
  //             </div>
  //           </li>
  //         );
  //       } else {
  //         return null;
  //       }
  //     });
  //   };

  useEffect(() => {
    if (!user && !isLoginPage) {
      navigate("/admin/login");
    }
  }, [isLoginPage, user, navigate]);

  return (
    <div className="drawer" data-theme="dark">
      <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
      <div className="!max-w-screen min-w-screen drawer-content relative flex min-h-[calc(100vh-64px)] flex-col  items-center  justify-start">
        <div className="navbar relative w-full bg-base-300">
          {user && (
            <div className="flex-none lg:hidden">
              <label htmlFor="my-drawer-3" className="btn-ghost btn-square btn">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="inline-block h-6 w-6 stroke-current"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  ></path>
                </svg>
              </label>
            </div>
          )}
          <div className="mx-2 flex flex-1 flex-row gap-4 px-2 font-bold">
            <IoHomeSharp
              size={34}
              className="cursor-pointer rounded-full bg-primary p-[0.4rem] text-primary-content transition-all duration-200 hover:scale-105"
              onClick={() => navigate("/admin")}
            />
            {/* <img src={image} className="h-5 select-none" /> */}

            <button
              className={"btn-primary btn-md absolute right-2 sm:relative"}
              onClick={() => navigate("/")}
            >
              Website
            </button>
          </div>
          <div className="relative hidden flex-none lg:absolute lg:left-1/2 lg:block lg:translate-x-[-50%]">
            <ul className="menu menu-horizontal">
              <li onClick={() => navigate("/admin/users")}>
                <div>
                  {/* {Icon && <Icon className="h-6 w-auto text-primary-content" />} */}
                  <span>Users</span>
                </div>
              </li>

              <li onClick={() => navigate("/admin/orders")}>
                <div>
                  {/* {Icon && <Icon className="h-6 w-auto text-primary-content" />} */}
                  <span>Orders</span>
                </div>
              </li>

              <li onClick={() => navigate("/admin/campaigns")}>
                <div>
                  {/* {Icon && <Icon className="h-6 w-auto text-primary-content" />} */}
                  <span>Campaigns</span>
                </div>
              </li>

              <li onClick={() => navigate("/admin/root-categories")}>
                <div>
                  {/* {Icon && <Icon className="h-6 w-auto text-primary-content" />} */}
                  <span>Categories</span>
                </div>
              </li>

              <li onClick={() => navigate("/admin/products")}>
                <div>
                  {/* {Icon && <Icon className="h-6 w-auto text-primary-content" />} */}
                  <span>Products</span>
                </div>
              </li>

              <li onClick={() => navigate("/admin/articles")}>
                <div>
                  {/* {Icon && <Icon className="h-6 w-auto text-primary-content" />} */}
                  <span>Articles</span>
                </div>
              </li>
            </ul>
          </div>
          {user && (
            <li className="hidden lg:absolute lg:right-2 lg:block">
              {LogoutButton()}
            </li>
          )}
          {!user && <>{LoginButton()}</>}
        </div>

        <Outlet />
      </div>
      <div className="drawer-side">
        <label htmlFor="my-drawer-3" className="drawer-overlay" />
        <ul className="menu w-80 bg-base-100 p-4">
          {/* <img src={image} className="mb-3 mt-6 h-6 select-none" /> */}
          <div className="divider w-full" />
          {/* {user && renderRoutes(adminRoutes)} */}
          {user && <>{LogoutButton("absolute bottom-4 right-4")}</>}
        </ul>
      </div>
    </div>
  );
};

export default Admin;
