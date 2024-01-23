import Cart from "~/modules/Website/Cart";
import Home from "~/modules/Website/Home";
import Account from "~/modules/Website/Account";
import Products from "~/modules/Website/Products";
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
import { Register } from "~/modules/Website/Register";
import { Login } from "~/modules/Website/Login";

export const loader = async ({ request, params }: ActionFunctionArgs) => {
  const page = params?.pagel1;

  switch (page) {
    case "account":
      return await accountLoader(request);
    case "cart":
      return await cartLoader(request);
    case "home":
      return await homeLoader();
    case "login":
      return null;
    case "logout":
      return await logoutLoader();
    case "password-recovery":
      return null;
    case "product":
      return null;
    case "products":
      return await productsLoader(request);
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
      return await cartAction(request);
    case "login":
      return await loginAction(request);
    case "logout":
      return await logoutAction(request);
    case "products":
      return await productsAction(request);
    case "register":
      return await registerAction(request);
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
