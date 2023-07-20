import type { LinksFunction } from "@remix-run/node";
import { useState } from "react";
import { json } from "@remix-run/node";
import stylesheet from "~/tailwind.css";
import Footer from "~/components/Layout/Footer";
import { getBrands } from "~/models/brands.server";
import { cssBundleHref } from "@remix-run/css-bundle";
import CartButton from "~/components/Buttons/CartButton";
import { getRootCategories } from "~/models/rootCategories.server";
import AccountButton from "~/components/Buttons/AccountButton";
import { IoHomeSharp, IoMenu, IoSearchOutline } from "react-icons/io5";
import {
  Outlet,
  useLoaderData,
  useNavigate,
  useSubmit,
  useRouteLoaderData,
} from "@remix-run/react";
import SearchBar from "~/components/SearchBar";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];

export const loader = async () => {
  const rootCategories = await getRootCategories();
  const brands = await getBrands();

  return json({ rootCategories, brands });
};

const App = () => {
  const navigate = useNavigate();
  const submit = useSubmit();

  const { rootCategories, brands } =
    (useLoaderData() as {
      rootCategories: RootCategory[];
      brands: Brand[];
    }) || {};
  const user = useRouteLoaderData("root") as User;
  const { cart } = user || {};

  const [searchActive, setSearchActive] = useState<boolean | null>(false);

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

  return (
    <div className="drawer" data-theme="brand-light">
      <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
      <div className="!max-w-screen min-w-screen drawer-content relative flex min-h-[calc(100vh-64px)] flex-col items-center justify-start overflow-x-hidden">
        <div className="navbar relative w-full bg-brand-black">
          <div className="flex-none lg:hidden">
            <label htmlFor="my-drawer-3" className="btn-ghost btn-square btn">
              <IoMenu size={26} />
            </label>
            <div className="absolute right-6 flex gap-6">
              {user && <AccountButton {...user} />}
              {cart && <CartButton {...cart} />}

              <IoSearchOutline
                className={
                  "cursor-pointer text-brand-white" +
                  (!user && "relative bottom-0 right-20 top-0")
                }
                size={24}
                onClick={() => setSearchActive(!searchActive)}
              />
            </div>
          </div>

          <div className="mx-2 flex flex-1 flex-row gap-4 px-2 font-bold">
            <IoHomeSharp
              size={48}
              className="cursor-pointer bg-primary p-3 text-primary-content transition-all duration-200 hover:scale-105"
              onClick={() => navigate("/")}
            />
            <h1 className="select-none text-xl font-bold tracking-widest text-white">
              CLUTCH.
            </h1>
          </div>
          <div className="relative hidden flex-none lg:absolute lg:left-1/2 lg:translate-x-[-50%] xl:block">
            <ul className="menu menu-horizontal">
              {rootCategories?.map(({ id, name }: RootCategory) => {
                return (
                  <li
                    key={"menu_rootCategory_" + id}
                    className="cursor-pointer border-b-2 border-primary-content/0 px-3 py-3 text-sm font-bold tracking-wide text-brand-white hover:bg-primary-content/10"
                    onClick={() =>
                      navigate({
                        pathname: "/products",
                        search: `?rootCategory=${name}`,
                      })
                    }
                  >
                    {name.toUpperCase()}
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="hidden gap-6 lg:absolute lg:right-2 lg:flex">
            {user && <AccountButton {...user} />}
            {cart && <CartButton {...cart} />}
            <div className="cursor-pointer">
              <IoSearchOutline
                size={24}
                onClick={() => setSearchActive(!searchActive)}
                className="text-brand-white"
              />
            </div>
            {user && <div>{LogoutButton()}</div>}
            {!user && <div>{LoginButton()}</div>}
          </div>
        </div>

        {searchActive && (
          <SearchBar rootCategories={rootCategories} brands={brands} />
        )}

        <Outlet />

        <Footer />
      </div>
      <div className="drawer-side">
        <label htmlFor="my-drawer-3" className="drawer-overlay"></label>
        <ul className="menu w-80 bg-base-100 p-4">
          {rootCategories?.map(({ id, name }: RootCategory) => {
            return (
              <li
                key={"menu_rootCategory_" + id}
                className="cursor-pointer border-b-2 border-primary-content/0 px-3 py-3 text-sm font-bold tracking-wide hover:bg-primary-content/10"
                onClick={() =>
                  navigate({
                    pathname: "/products",
                    search: `?rootCategory=${name}`,
                  })
                }
              >
                {name.toUpperCase()}
              </li>
            );
          })}
          {user && <>{LogoutButton("absolute bottom-4 right-4")}</>}
        </ul>
      </div>
    </div>
  );
};

export default App;
