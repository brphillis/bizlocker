import Cart from "~/modules/Website/Cart";
import Home from "~/modules/Website/Home";
import Login from "~/modules/Website/Login";
import Account from "~/modules/Website/Account";
import Products from "~/modules/Website/Products";
import Register from "~/modules/Website/Register";
import { Outlet, useParams } from "@remix-run/react";
import { homeLoader } from "~/modules/Website/Home/index.server";
import { loginAction } from "~/modules/Website/Login/index.server";
import { type ActionFunctionArgs } from "@remix-run/server-runtime";
import { accountLoader } from "~/modules/Website/Account/index.server";
import { registerAction } from "~/modules/Website/Register/index.server";
import { cartAction, cartLoader } from "~/modules/Website/Cart/index.server";
import {
  logoutAction,
  logoutLoader,
} from "~/modules/Website/Logout/index.server";
import {
  productsAction,
  productsLoader,
} from "~/modules/Website/Products/index.server";
import { webPageLoader } from "~/modules/Website/WebPage/index.server";
import WebPage from "~/modules/Website/WebPage";

export const loader = async ({ request, params }: ActionFunctionArgs) => {
  const page = params?.pagel1;

  switch (page) {
    case "account":
      return await accountLoader(request, params);
    case "cart":
      return await cartLoader(request, params);
    case "home":
      return await homeLoader(request, params);
    case "login":
      return null;
    case "logout":
      return await logoutLoader(request, params);
    case "password-recovery":
      return null;
    case "product":
      return null;
    case "products":
      return await productsLoader(request, params);
    case "promotion":
      return null;
    case "register":
      return null;
    case "verify":
      return null;
    default:
      return await webPageLoader(request, params);
  }
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const page = params?.pagel1;

  switch (page) {
    case "cart":
      return await cartAction(request, params);
    case "login":
      return await loginAction(request, params);
    case "logout":
      return await logoutAction(request, params);
    case "products":
      return await productsAction(request, params);
    case "register":
      return await registerAction(request, params);
  }
};

const PageL1 = () => {
  const { pagel1 } = useParams();
  let activeModule;
  let useOutlet = true;

  switch (pagel1) {
    case "account":
      activeModule = <Account />;
      useOutlet = false;
      break;
    case "cart":
      activeModule = <Cart />;
      break;
    case "home":
      activeModule = <Home />;
      break;
    case "login":
      activeModule = <Login />;
      break;
    case "products":
      activeModule = <Products />;
      break;
    case "register":
      activeModule = <Register />;
      break;
    default:
      activeModule = <WebPage />;
  }

  return (
    <>
      {activeModule}
      {useOutlet && <Outlet />}
    </>
  );
};

export default PageL1;
