import { useEffect, useState } from "react";
import Spinner from "~/components/Spinner";
import SearchBar from "~/components/SearchBar";
import { getCart } from "~/models/Cart/index.server";
import { getBrands } from "~/models/Brands/index.server";
import Footer from "~/components/Layout/_Website/Footer";
import DarkOverlay from "~/components/Layout/Overlays/DarkOverlay";
import { getUserDataFromSession } from "~/session.server";
import { getDepartments } from "~/models/Departments/index.server";
import { getProductCategories } from "~/models/ProductCategories/index.server";
import {
  json,
  type MetaFunction,
  type LoaderFunctionArgs,
} from "@remix-run/node";
import {
  Outlet,
  useLoaderData,
  useLocation,
  useNavigation,
} from "@remix-run/react";

import "../../node_modules/swiper/swiper.min.css";
import "../../node_modules/swiper/modules/navigation.min.css";
import "../../node_modules/swiper/modules/pagination.min.css";
import "sweetalert2/dist/sweetalert2.css";

import { User } from "@prisma/client";
import CountDown from "~/components/Indicators/Countdown";
import HamburgerContainer from "~/components/Layout/_Website/Navigation/Mobile/_HamburgerContainer";
import ProductMegaMenu from "~/components/Layout/_Website/Navigation/Desktop/ProductMegaMenu";
import { GetRandomActivePromotions } from "~/models/Promotions/index.server";
import ProductBasic from "~/components/Layout/_Website/Navigation/Mobile/ProductBasic";

export const meta: MetaFunction = () => {
  return [
    { title: "CLUTCH Clothing" },
    {
      name: "CLUTCH Clothing",
      content: "CLUTCH Clothing",
    },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = (await getUserDataFromSession(request)) as User | null;
  const cart = await getCart(request);

  const departments = await getDepartments();
  const brands = await getBrands();
  const productCategories = await getProductCategories();

  const navigationPromotions = await GetRandomActivePromotions(2, true);

  return json({
    user,
    cart,
    departments,
    productCategories,
    brands,
    navigationPromotions,
  });
};

const App = () => {
  const navigation = useNavigation();
  const location = useLocation();

  const {
    user,
    cart,
    departments,
    brands,
    productCategories,
    navigationPromotions,
  } = useLoaderData<typeof loader>();

  const [searchActive, setSearchActive] = useState<boolean | null>(false);

  useEffect(() => {
    setSearchActive(false);
  }, [location]);

  return (
    <div className="drawer" data-theme="brand-light">
      <input
        id="mobile-navigation-state"
        type="checkbox"
        className="drawer-toggle"
      />
      <div className="drawer-content relative flex min-h-[calc(100dvh-60px)] flex-col items-center justify-start">
        <div
          id="NavigationBar"
          className="navbar relative !min-h-[60px] w-full justify-center bg-brand-black !py-0"
        >
          <div className="relative flex h-full w-[1280px] max-w-full flex-row items-start justify-between">
            {/* MOBILE HAMBURGER AND SEARCH BUTTON */}
            <HamburgerContainer
              user={user}
              cart={cart}
              searchState={searchActive}
              setSearchState={setSearchActive}
            />

            {/* DESKTOP NAVIGATION */}
            {/* <ProductBasicDesktopNavigation
              departments={departments}
              productCategories={productCategories}
              user={user}
              cart={cart}
              searchState={searchActive}
              setSearchState={setSearchActive}
            /> */}

            <ProductMegaMenu
              departments={departments}
              productCategories={productCategories}
              randomPromotions={navigationPromotions}
              user={user}
              cart={cart}
              searchState={searchActive}
              setSearchState={setSearchActive}
            />
          </div>
        </div>

        {searchActive && (
          <SearchBar
            departments={departments}
            productCategories={productCategories}
            brands={brands}
          />
        )}

        {!(
          location.pathname.includes("/login") ||
          location.pathname.includes("/register") ||
          location.pathname.includes("/password-recovery") ||
          location.pathname.includes("/verify") ||
          location.pathname.includes("/account")
        ) && (
          <div className="navbar relative z-0 flex !min-h-[50px] w-full select-none items-center justify-center gap-6 bg-brand-white !py-0 text-sm font-bold text-brand-black/80 shadow-md">
            <div className="max-md:text-xs">SEASON SALE ENDS SOON!</div>
            <CountDown targetDate={new Date("2024-03-03T00:00:00")} />
          </div>
        )}

        {navigation.state === ("loading" || "submitting") &&
          navigation.formAction !== "/products" && (
            <DarkOverlay fadeIn={true}>
              <Spinner mode="shirt" extendStyle={"mt-16"} />
            </DarkOverlay>
          )}
        <Outlet />

        <Footer />
      </div>

      {/* MOBILE DRAWER */}
      <ProductBasic
        departments={departments}
        productCategories={productCategories}
        user={user}
      />
    </div>
  );
};

export default App;
