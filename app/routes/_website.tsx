import { useEffect, useState } from "react";
import Spinner from "~/components/Spinner";
import SearchBar from "~/components/SearchBar";
import { getCart } from "~/models/cart.server";
import { getBrands } from "~/models/brands.server";
import Footer from "~/components/Layout/_Website/Footer";
import DarkOverlay from "~/components/Layout/Overlays/DarkOverlay";
import { getUserDataFromSession } from "~/session.server";
import { getDepartments } from "~/models/departments.server";
import { getProductCategories } from "~/models/productCategories.server";
import {
  json,
  type MetaFunction,
  type LoaderFunctionArgs,
} from "@remix-run/node";
import MobileMenu from "~/components/Layout/_Website/Navigation/MobileMenu";
import DesktopMenu from "~/components/Layout/_Website/Navigation/DesktopMenu";
import {
  Outlet,
  useLoaderData,
  useLocation,
  useNavigate,
  useNavigation,
} from "@remix-run/react";
import MobileButtonContainer from "~/components/Layout/_Website/Navigation/MobileButtonContainer";
import DesktopButtonContainer from "~/components/Layout/_Website/Navigation/DesktopButtonContainer";

import "../../node_modules/swiper/swiper.min.css";
import "../../node_modules/swiper/modules/navigation.min.css";
import "../../node_modules/swiper/modules/pagination.min.css";
import "sweetalert2/dist/sweetalert2.css";

import type { User } from "@prisma/client";
import CountDown from "~/components/Indicators/Countdown";

export const meta: MetaFunction = ({ data }) => {
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
  let cart = await getCart(request);

  const departments = await getDepartments();
  const brands = await getBrands();
  const productCategories = await getProductCategories();

  return json({ user, cart, departments, productCategories, brands });
};

const App = () => {
  const navigate = useNavigate();
  const navigation = useNavigation();
  const location = useLocation();

  const { user, cart, departments, brands, productCategories } =
    useLoaderData<typeof loader>();

  const [searchActive, setSearchActive] = useState<boolean | null>(false);

  useEffect(() => {
    setSearchActive(false);
  }, [location]);

  return (
    <div className="drawer" data-theme="brand-light">
      <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content relative flex min-h-[calc(100vh-60px)] flex-col items-center justify-start overflow-x-hidden">
        <div
          id="NavigationBar"
          className="navbar relative !min-h-[60px] w-full justify-center bg-brand-black !py-0"
        >
          <div className="flex h-full w-[1280px] max-w-full flex-row items-start justify-between">
            <MobileButtonContainer
              user={user}
              cart={cart}
              setSearchState={setSearchActive}
              searchState={searchActive}
            />

            <div
              className="absolute left-16 flex h-[60px] flex-row items-center gap-4 px-2 font-bold lg:relative lg:left-0"
              onClick={() => navigate("/home")}
            >
              <h1 className="cursor-pointer select-none text-xl font-bold tracking-widest text-brand-white">
                CLUTCH.
              </h1>
            </div>

            <DesktopMenu
              departments={departments}
              productCategories={productCategories}
            />

            <DesktopButtonContainer
              user={user}
              cart={cart}
              setSearchState={setSearchActive}
              searchState={searchActive}
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
          location.pathname.includes("/forgot-password") ||
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

      <MobileMenu
        departments={departments}
        productCategories={productCategories}
        user={user}
      />
    </div>
  );
};

export default App;
