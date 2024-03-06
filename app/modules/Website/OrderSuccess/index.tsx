import { useSearchParams } from "@remix-run/react";
import { IoCheckmarkCircle } from "react-icons/io5";
import PageWrapper from "~/components/Layout/Wrappers/PageWrapper";

const OrderSuccess = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  return (
    <PageWrapper>
      <div className="w-[520px] max-w-full bg-base-100 px-0 lg:px-3">
        <div className="mt-3 flex flex-col items-center gap-3 justify-center">
          <h1 className="text-center text-2xl pb-3">
            Your Order Has Been Submitted!
          </h1>

          <IoCheckmarkCircle size={64} className="text-success" />

          {id && (
            <div className="flex flex-col items-center justify-center py-3">
              <p className="text-sm">Order Id</p>
              <p className="font-bold">{id}</p>
            </div>
          )}

          <p className="text-center text-sm pb-6 px-3">
            Thank you for choosing Clutch Clothing! Your purchase has been
            Successfully Processed. Our team will carefully package your items
            and are ready to bring Style and Quality to your wardrobe.
          </p>
        </div>

        <div className="divider w-full" />
      </div>
    </PageWrapper>
  );
};

export default OrderSuccess;
