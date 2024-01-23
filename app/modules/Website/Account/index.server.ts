import { redirect, type MetaFunction } from "@remix-run/node";

export const meta: MetaFunction<typeof accountLoader> = () => {
  return [
    { title: "CLUTCH | Your Account" },
    {
      name: "CLUTCH | Your Account",
      content: "CLUTCH | Your Account",
    },
  ];
};

export const accountLoader = async (request: Request) => {
  const url = new URL(request.url);
  const isAccountPage = url.pathname === "/account";

  if (isAccountPage) {
    return redirect("/account/profile");
  } else return null;
};
