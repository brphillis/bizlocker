import { useState } from "react";
import stylesheet from "~/tailwind.css";
import SearchBar from "~/components/SearchBar";
import { getCart } from "~/models/cart.server";
import Footer from "~/components/Layout/_Website/Footer";
import { getUserObject } from "~/session.server";
import { getBrands } from "~/models/brands.server";
import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction, LoaderArgs } from "@remix-run/node";
import { getProductCategories } from "~/models/productCategories.server";
import {
  Outlet,
  useLoaderData,
  useLocation,
  useNavigate,
  useNavigation,
} from "@remix-run/react";

import "sweetalert2/dist/sweetalert2.css";
import DarkOverlay from "~/components/Layout/DarkOverlay";
import Spinner from "~/components/Spinner";
import MobileMenu from "~/components/Layout/_Website/Navigation/MobileMenu";
import DesktopMenu from "~/components/Layout/_Website/Navigation/DesktopMenu";
import MobileButtonContainer from "~/components/Layout/_Website/Navigation/MobileButtonContainer";
import DesktopButtonContainer from "~/components/Layout/_Website/Navigation/DesktopButtonContainer";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];

export const loader = async ({ request }: LoaderArgs) => {
  const user = await getUserObject(request);
  let cart;
  if (user) {
    cart = await getCart(request);
  }
  const productCategories = await getProductCategories();
  const brands = await getBrands();

  return { user, cart, productCategories, brands };
};

const App = () => {
  const navigate = useNavigate();
  const navigation = useNavigation();
  const location = useLocation();

  const { user, cart, productCategories, brands } = useLoaderData();

  const [searchActive, setSearchActive] = useState<boolean | null>(false);

  return (
    <div className="drawer" data-theme="brand-light">
      <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content relative flex min-h-[calc(100vh-64px)] flex-col items-center justify-start overflow-x-hidden">
        <div className="navbar relative !min-h-[60px] w-full justify-center bg-brand-black !py-0">
          <div className="flex h-full w-[1280px] max-w-full flex-row justify-between">
            <MobileButtonContainer
              user={user}
              cart={cart}
              setSearchState={setSearchActive}
              searchState={searchActive}
            />

            <div
              className="absolute left-16 flex h-full flex-row items-center gap-4 px-2 font-bold lg:relative lg:left-0"
              onClick={() => navigate("/home")}
            >
              <h1 className="-mt-1 cursor-pointer select-none text-xl font-bold tracking-widest text-white">
                CLUTCH.
              </h1>
            </div>

            <DesktopMenu productCategories={productCategories} />

            <DesktopButtonContainer
              user={user}
              cart={cart}
              setSearchState={setSearchActive}
              searchState={searchActive}
            />
          </div>
        </div>

        {searchActive && (
          <SearchBar productCategories={productCategories} brands={brands} />
        )}

        {!(
          location.pathname.includes("/login") ||
          location.pathname.includes("/register") ||
          location.pathname.includes("/forgot-password")
        ) && (
          <div className="navbar relative flex !min-h-[50px] w-full items-center justify-center bg-base-200 !py-0 text-sm font-bold text-brand-black/80 shadow-md">
            <p className="cursor-pointer">
              BUY NOW - SELL LATER - FREE RETURNS
            </p>
          </div>
        )}

        {navigation.state === ("loading" || "submitting") &&
          navigation.formAction !== "/products" && (
            <DarkOverlay fadeIn={true}>
              <Spinner />
            </DarkOverlay>
          )}
        <Outlet />

        <Footer />
      </div>

      <MobileMenu productCategories={productCategories} user={user} />
    </div>
  );
};

export default App;
