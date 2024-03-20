import Cart from "~/modules/Website/Cart";
import Account from "~/modules/Website/Account";
import Products from "~/modules/Website/Products";
import { Outlet, useParams } from "@remix-run/react";
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
import { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import OrderSuccess from "~/modules/Website/OrderSuccess";
import { orderSuccessLoader } from "~/modules/Website/OrderSuccess/index.server";
import { previewLoader } from "~/modules/Website/Preview/index.server";
import Preview from "~/modules/Website/Preview";

export const meta: MetaFunction = ({ data }) => {
  const loaderMeta = (data as { meta: MetaType })?.meta;
  return [
    { title: loaderMeta?.title },
    {
      name: "description",
      content: loaderMeta?.description,
    },
  ];
};

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const page = params?.pagel1;

  switch (page) {
    case "account":
      return await accountLoader(request);
    case "cart":
      return await cartLoader(request);
    case "login":
      return null;
    case "logout":
      return await logoutLoader();
    case "order-success":
      return await orderSuccessLoader();
    case "password-recovery":
      return null;
    case "payment-confirm":
      return null;
    case "preview":
      return await previewLoader(request);
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
    case "login":
      activeModule = <Login />;
      break;
    case "order-success":
      activeModule = <OrderSuccess />;
      break;
    case "password-recovery":
      activeModule = null;
      break;
    case "payment-confirm":
      activeModule = null;
      break;
    case "preview":
      activeModule = <Preview />;
      break;
    case "product":
      activeModule = null;
      break;
    case "products":
      activeModule = <Products />;
      break;
    case "promotion":
      activeModule = null;
      break;
    case "register":
      activeModule = <Register />;
      break;
    case "verify":
      activeModule = null;
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
