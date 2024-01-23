import { Params } from "@remix-run/react";
import { json, type MetaFunction } from "@remix-run/node";
import { verifyUserAccount } from "~/models/Verification/index.server";

export const meta: MetaFunction = () => {
  return [
    { title: "CLUTCH | Verification" },
    {
      name: "CLUTCH | Verification",
      content: "CLUTCH | Verification",
    },
  ];
};

export const verifyConfirmLoader = async (
  request: Request,
  params: Params<string>,
) => {
  const url = new URL(request.url);
  const verificationCode = params.pagel2;
  const emailAddress = url.searchParams.get("email");

  if (emailAddress && verificationCode) {
    const { success: verified } = await verifyUserAccount(
      emailAddress,
      verificationCode,
    );
    return json(verified);
  } else return null;
};
