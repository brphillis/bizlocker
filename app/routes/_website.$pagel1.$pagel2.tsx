import Article from "~/modules/Website/Article";
import Product from "~/modules/Website/Product";
import Promotion from "~/modules/Website/Promotion";
import { Outlet, useParams } from "@remix-run/react";
import { getParentPageName } from "~/helpers/urlHelpers";
import AccountOrders from "~/modules/Website/Account/Orders";
import VerifyRequest from "~/modules/Website/Verify/Request";
import VerifyConfirm from "~/modules/Website/Verify/Confirm";
import AccountAddress from "~/modules/Website/Account/Address";
import AccountProfile from "~/modules/Website/Account/Profile";
import { type ActionFunctionArgs } from "@remix-run/server-runtime";
import { articleLoader } from "~/modules/Website/Article/index.server";
import { productLoader } from "~/modules/Website/Product/index.server";
import PasswordRecoveryReset from "~/modules/Website/PasswordRecovery/Reset";
import { accountOrdersLoader } from "~/modules/Website/Account/Orders/index.server";
import { verifyRequestAction } from "~/modules/Website/Verify/Request/index.server";
import { verifyConfirmLoader } from "~/modules/Website/Verify/Confirm/index.server";
import { paymentConfirmLoader } from "~/modules/Website/PaymentConfirm/index.server";
import { PasswordRecoveryRequest } from "~/modules/Website/PasswordRecovery/Request";
import {
  promotionAction,
  promotionLoader,
} from "~/modules/Website/Promotion/index.server";
import { passwordRecoveryRequestAction } from "~/modules/Website/PasswordRecovery/Request/index.server";
import {
  accountAddressAction,
  accountAddressLoader,
} from "~/modules/Website/Account/Address/index.server";
import {
  accountProfileAction,
  accountProfileLoader,
} from "~/modules/Website/Account/Profile/index.server";
import {
  passwordRecoveryResetAction,
  passwordRecoveryResetLoader,
} from "~/modules/Website/PasswordRecovery/Reset/index.server";

export const loader = async ({ request, params }: ActionFunctionArgs) => {
  const page = params?.pagel2;
  const parentPageName = getParentPageName(request);

  if (parentPageName === "account") {
    switch (page) {
      case "address":
        return await accountAddressLoader(request, params);
      case "orders":
        return await accountOrdersLoader(request, params);
      case "profile":
        return await accountProfileLoader(request, params);
    }
  }
  if (parentPageName === "article") {
    return await articleLoader(request, params);
  }
  if (parentPageName === "password-recovery" && page !== "request") {
    return await passwordRecoveryResetLoader(request, params);
  }
  if (parentPageName === "payment-confirm") {
    return await paymentConfirmLoader(request, params);
  }
  if (parentPageName === "product") {
    return await productLoader(request, params);
  }
  if (parentPageName === "promotion") {
    return await promotionLoader(request, params);
  }
  if (parentPageName === "verify" && page !== "request") {
    return await verifyConfirmLoader(request, params);
  } else return null;
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const page = params?.pagel2;
  const parentPageName = getParentPageName(request);

  if (parentPageName === "account") {
    switch (page) {
      case "address":
        return await accountAddressAction(request, params);
      case "profile":
        return await accountProfileAction(request, params);
    }
  }
  if (parentPageName === "verify" && page === "request") {
    return await verifyRequestAction(request, params);
  }
  if (parentPageName === "password-recovery") {
    if (page === "request") {
      return await passwordRecoveryRequestAction(request, params);
    } else {
      return await passwordRecoveryResetAction(request, params);
    }
  }
  if (parentPageName === "promotion") {
    return await promotionAction(request, params);
  }
};

const PageL2 = () => {
  const { pagel1, pagel2 } = useParams();
  let activeModule;
  let useOutlet = true;

  switch (pagel1) {
    case "article":
      activeModule = <Article />;
      break;
    case "product":
      activeModule = <Product />;
      break;
    case "password-recovery":
      if (pagel2 === "request") {
        activeModule = <PasswordRecoveryRequest />;
      } else {
        activeModule = <PasswordRecoveryReset />;
      }
      break;
    case "promotion":
      activeModule = <Promotion />;
      break;
    case "verify":
      if (pagel2 === "request") {
        activeModule = <VerifyRequest />;
      } else {
        activeModule = <VerifyConfirm />;
      }
      break;
  }

  if (!activeModule) {
    switch (pagel2) {
      case "address":
        activeModule = <AccountAddress />;
        useOutlet = false;
        break;
      case "orders":
        activeModule = <AccountOrders />;
        break;
      case "profile":
        activeModule = <AccountProfile />;
        break;
    }
  }

  return (
    <>
      {activeModule}
      {useOutlet && <Outlet />}
    </>
  );
};

export default PageL2;
