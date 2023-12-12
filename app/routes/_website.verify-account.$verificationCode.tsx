import { useEffect } from "react";
import { IoCheckmarkCircle } from "react-icons/io5";
import { json, type ActionFunctionArgs } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import PageWrapper from "~/components/Layout/_Website/PageWrapper";
import { verifyUserAccount } from "~/models/auth/verification.server";

export const loader = async ({ params, request }: ActionFunctionArgs) => {
  const url = new URL(request.url);
  const verificationCode = params.verificationCode;
  const emailAddress = url.searchParams.get("email");

  if (emailAddress && verificationCode) {
    const { success: verified } = await verifyUserAccount(
      emailAddress,
      verificationCode
    );
    return json(verified);
  } else return null;
};

const VerifyAccount = () => {
  const verified = useLoaderData<typeof loader>();
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
            </>
          )}
          {!verified && (
            <h1 className="text-center text-2xl">Invalid Verification Code</h1>
          )}

          <IoCheckmarkCircle
            size={102}
            className="mt-12 animate-bounce text-success"
          />

          <p>Redirecting you to login...</p>
        </div>
      </div>
    </PageWrapper>
  );
};

export default VerifyAccount;
