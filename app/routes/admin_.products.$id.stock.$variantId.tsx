import { tokenAuth } from "~/auth.server";
import type { Staff } from "@prisma/client";
import { Form, useLoaderData } from "@remix-run/react";
import DarkOverlay from "~/components/Layout/DarkOverlay";
import FormHeader from "~/components/Forms/Headers/FormHeader";
import { getUserDataFromSession, STAFF_SESSION_KEY } from "~/session.server";
import {
  getProductVariantStock,
  type StockLevelWithDetails,
} from "~/models/stock.server";
import {
  json,
  redirect,
  type LinksFunction,
  type LoaderFunctionArgs,
} from "@remix-run/node";
import swiper from "../../node_modules/swiper/swiper.min.css";
import swiperNav from "../../node_modules/swiper/modules/navigation.css";
export const links: LinksFunction = () => [
  { rel: "stylesheet", href: swiper },
  { rel: "stylesheet", href: swiperNav },
];

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const authenticated = await tokenAuth(request, STAFF_SESSION_KEY);

  if (!authenticated.valid) {
    return redirect("/admin/login");
  }

  const id = params?.variantId;

  if (!id) {
    throw new Response(null, {
      status: 404,
      statusText: "Stock Not Found",
    });
  }

  const stock = await getProductVariantStock(id);

  if (!stock) {
    throw new Response(null, {
      status: 404,
      statusText: "Stock Not Found",
    });
  }

  const { storeId } =
    ((await getUserDataFromSession(request, STAFF_SESSION_KEY)) as Staff) || {};

  return json({
    storeId,
    stock,
  });
};

// export const action = async ({ request, params }: ActionFunctionArgs) => {
//   const authenticated = await tokenAuth(request, STAFF_SESSION_KEY);
//   if (!authenticated.valid) {
//     return redirect("/admin/login");
//   }

//   const id = params.id === "add" ? undefined : params.id;
//   const form = Object.fromEntries(await request.formData());
//   const {} = form;

//   switch (form._action) {
//     case "upsert":

//     case "delete":

//   }
// };

const ManageStock = () => {
  const { stock } = useLoaderData<typeof loader>();

  return (
    <DarkOverlay>
      <Form
        method="POST"
        className="scrollbar-hide relative w-[600px] max-w-full overflow-y-auto bg-base-200 px-3 py-6 sm:px-6"
      >
        <FormHeader type="Stock" hasIsActive={false} hasDelete={false} />

        <div className="mx-auto w-full">
          <table className="table">
            <thead>
              <tr>
                <th></th>
                <th>Store</th>
                <th className="text-center">Quantity</th>
                <th className="text-center">Request</th>
              </tr>
            </thead>
            <tbody>
              {stock?.map(
                ({ store, quantity }: StockLevelWithDetails, index: number) => {
                  const { name } = store || {};
                  return (
                    <tr key={"stockLevelTableRow_" + index}>
                      <th>{index + 1}</th>
                      <td>{name}</td>
                      <td className="text-center">{quantity}</td>
                      <td className="item-center flex justify-center">
                        <button
                          className="btn-primary btn-sm rounded-sm"
                          type="button"
                        >
                          Transfer
                        </button>
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        </div>
      </Form>
    </DarkOverlay>
  );
};

export default ManageStock;
