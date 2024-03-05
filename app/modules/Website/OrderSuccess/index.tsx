import { IoCheckmarkCircle } from "react-icons/io5";
import PageWrapper from "~/components/Layout/Wrappers/PageWrapper";

const OrderSuccess = () => {
  return (
    <PageWrapper>
      <div className="w-[520px] max-w-full bg-base-100 px-0 lg:px-3">
        <div className="mt-3 flex flex-col items-center gap-3">
          <h1 className="text-center text-2xl">
            Your Order Has Been Submitted!
          </h1>

          <p className="text-center text-sm py-6 px-3">
            Thank you for choosing Clutch Clothing! Your purchase has been
            Successfully Processed. Our team will carefully package your items
            and are ready to bring Style and Quality to your wardrobe.
          </p>

          <IoCheckmarkCircle size={42} className="text-success" />
        </div>

        <div className="divider w-full" />
      </div>
    </PageWrapper>
  );
};

export default OrderSuccess;
