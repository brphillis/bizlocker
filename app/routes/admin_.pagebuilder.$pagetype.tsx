import { redirect, type ActionFunctionArgs } from "@remix-run/server-runtime";
import { tokenAuth } from "~/auth.server";
import { STAFF_SESSION_KEY } from "~/session.server";
import { PageBuilderModule } from "~/modules/Admin/PageBuilder";
import {
  pageBuilderAction,
  pageBuilderLoader,
} from "~/modules/Admin/PageBuilder/index.server";

export const loader = async ({ request, params }: ActionFunctionArgs) => {
  const authenticated = await tokenAuth(request, STAFF_SESSION_KEY);

  if (!authenticated.valid) {
    return redirect("/admin/login");
  }

  return await pageBuilderLoader(request, params);
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const authenticated = await tokenAuth(request, STAFF_SESSION_KEY);

  if (!authenticated.valid) {
    return redirect("/admin/login");
  }

  return await pageBuilderAction(request, params);
};

const PageBuilderRoute = () => {
  return <PageBuilderModule />;
};

export default PageBuilderRoute;
