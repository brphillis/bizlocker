import { Form, Outlet, useLoaderData, useNavigate } from "@remix-run/react";
import DarkOverlay from "~/components/Layout/Overlays/DarkOverlay";
import BasicTitleBar from "~/components/Layout/TitleBars/BasicTitleBar";
import { type StockLevelWithDetails } from "~/models/stock.server";
import BasicButton from "~/components/Buttons/BasicButton";
import BackSubmitButtons from "~/components/Forms/Buttons/BackSubmitButtons";
import type { productStockLoader } from "./index.server";

const ProductStock = () => {
  const { stock } = useLoaderData<typeof productStockLoader>();

  const navigate = useNavigate();

  return (
    <>
      <DarkOverlay>
        <Form
          method="POST"
          className="scrollbar-hide relative w-[600px] max-w-full overflow-y-auto bg-base-200 px-3 py-6 sm:px-6"
        >
          <BasicTitleBar title="Stock" hasIsActive={false} />

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
                  (
                    { store, quantity }: StockLevelWithDetails,
                    index: number,
                  ) => {
                    const { name, id } = store || {};
                    return (
                      <tr key={"stockLevelTableRow_" + index}>
                        <th>{index + 1}</th>
                        <td>{name}</td>
                        <td className="text-center">{quantity}</td>
                        <td className="item-center flex justify-center">
                          <BasicButton
                            label="Transfer"
                            type="button"
                            onClick={() =>
                              navigate(
                                `/admin/upsert/product/productStockTransfer?contentId=${id}&fromStore=${store?.id}`,
                              )
                            }
                          />
                        </td>
                      </tr>
                    );
                  },
                )}
              </tbody>
            </table>
          </div>
          <BackSubmitButtons hideSubmit={true} />
        </Form>
      </DarkOverlay>
      <Outlet />
    </>
  );
};

export default ProductStock;
