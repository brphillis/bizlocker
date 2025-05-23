import { redirect } from "@remix-run/node";

export const accountLoader = async (request: Request) => {
  const url = new URL(request.url);
  const isAccountPage = url.pathname === "/account";

  if (isAccountPage) {
    return redirect("/account/profile");
  } else {
    const meta = {
      title: "CLUTCH | Account",
      description:
        "Discover timeless style and effortless sophistication with Clutch Clothing Australia. Elevate your wardrobe with our curated collection of premium apparel, designed for the modern Australian lifestyle. Explore our range today and experience fashion that's as versatile as you are.",
    };

    return { meta };
  }
};
