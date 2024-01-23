import { useEffect } from "react";
import { IoCheckmarkCircle, IoCloseCircle } from "react-icons/io5";
import { useLoaderData, useNavigate } from "@remix-run/react";
import PageWrapper from "~/components/Layout/Wrappers/PageWrapper";
import { verifyConfirmLoader } from "~/modules/Website/Verify/Confirm/index.server";

const VerifyConfirm = () => {
  const verified = useLoaderData<typeof verifyConfirmLoader>();
  const navigate = useNavigate();

  useEffect(() => {
    if (verified) {
      setTimeout(() => {
        navigate("/login");
      }, 7500);
    }
  }, [verified, navigate]);

  return (
    <PageWrapper>
      <div className="min-h-[62.3vh] py-6">
        <div className="flex flex-col items-center gap-3">
          {verified && (
            <>
              <h1 className="text-center text-2xl font-semibold">Success!</h1>
              <h1 className="text-center text-2xl">
                Your Account Has Been Verified
              </h1>

              <IoCheckmarkCircle
                size={102}
                className="mt-12 animate-bounce text-success"
              />

              <p>Redirecting you to login...</p>
            </>
          )}
          {!verified && (
            <>
              <h1 className="text-center text-2xl">
                Invalid Verification Code
              </h1>

              <IoCloseCircle
                size={102}
                className="mt-6 animate-pulse text-error"
              />

              <p>The verification code you entered does not match.</p>
            </>
          )}
        </div>
      </div>
    </PageWrapper>
  );
};

export default VerifyConfirm;
