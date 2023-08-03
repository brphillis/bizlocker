import { useState } from "react";
import stylesheet from "~/tailwind.css";
import SearchBar from "~/components/SearchBar";
import { getCart } from "~/models/cart.server";
import Footer from "~/components/Layout/Footer";
import { getUserObject } from "~/session.server";
import { getBrands } from "~/models/brands.server";
import { cssBundleHref } from "@remix-run/css-bundle";
import CartButton from "~/components/Buttons/CartButton";
import { IoMenu, IoSearchOutline } from "react-icons/io5";
import AccountButton from "~/components/Buttons/AccountButton";
import type { LinksFunction, LoaderArgs } from "@remix-run/node";
import { getRootCategories } from "~/models/rootCategories.server";
import {
  Outlet,
  useLoaderData,
  useNavigate,
  useSubmit,
} from "@remix-run/react";

import "sweetalert2/dist/sweetalert2.css";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];

export const loader = async ({ request }: LoaderArgs) => {
  const user = await getUserObject(request);
  const cart = await getCart(request);
  const rootCategories = await getRootCategories();
  const brands = await getBrands();

  return { user, cart, rootCategories, brands };
};

const App = () => {
  const navigate = useNavigate();
  const submit = useSubmit();

  const { user, cart, rootCategories, brands } = useLoaderData();

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
      <div className="drawer-content relative flex min-h-[calc(100vh-64px)] flex-col items-center justify-start overflow-x-hidden">
        <div className="navbar relative !min-h-[60px] w-full justify-center bg-brand-black !py-0">
          <div className="flex h-full w-[1280px] max-w-full flex-row justify-between">
            {/* mobile buttons */}
            <div className="flex items-center lg:hidden">
              <label
                htmlFor="my-drawer-3"
                className="btn btn-square btn-ghost text-brand-white/50"
              >
                <IoMenu size={26} />
              </label>
              <div className="absolute right-3 flex gap-6">
                {user && <AccountButton {...user} />}
                {cart && <CartButton {...cart} />}

                <IoSearchOutline
                  className="cursor-pointer text-brand-white"
                  size={24}
                  onClick={() => setSearchActive(!searchActive)}
                />
              </div>
            </div>

            <div className="absolute left-16 flex h-full flex-row items-center gap-4 px-2 font-bold lg:relative lg:left-0">
              <h1
                className="-mt-1 cursor-pointer select-none text-xl font-bold tracking-widest text-white"
                onClick={() => navigate("/")}
              >
                CLUTCH.
              </h1>
            </div>

            <div className="relative hidden h-full xl:block">
              <ul className="menu menu-horizontal h-full items-center !py-0">
                {rootCategories?.map(({ id, name }: RootCategory) => {
                  return (
                    <li
                      key={"menu_rootCategory_" + id}
                      className="flex h-full cursor-pointer items-center justify-center border-b-2 border-primary-content/0 px-3 py-3 text-sm font-bold tracking-wide text-brand-white hover:bg-primary-content/10"
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

            <div className="hidden gap-6 lg:flex">
              {user && <AccountButton {...user} />}
              {cart && <CartButton {...cart} />}

              <IoSearchOutline
                size={24}
                onClick={() => setSearchActive(!searchActive)}
                className="cursor-pointer !text-brand-white"
              />

              {!user && <div>{LoginButton()}</div>}
            </div>
          </div>
        </div>

        <div className="navbar relative flex !min-h-[50px] w-full items-center justify-center bg-base-200 !py-0 text-sm font-bold text-brand-black/80 shadow-md">
          BUY NOW - SELL LATER - FREE RETURNS
        </div>

        {searchActive && (
          <SearchBar rootCategories={rootCategories} brands={brands} />
        )}

        <Outlet />

        <Footer />
      </div>

      {/* mobile menu */}
      <div className="drawer-side">
        <label htmlFor="my-drawer-3" className="drawer-overlay"></label>
        <ul className="z-100 menu min-h-[100vh] w-64 bg-brand-black p-4 text-brand-white">
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
