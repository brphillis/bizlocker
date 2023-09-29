export const getCookies = (request: Request) => {
  const cookie = request.headers.get("Cookie");
  if (cookie) {
    const cookies = Object.fromEntries(
      cookie.split("; ").map((c: any) => {
        const [key, ...v] = c.split("=");
        return [key, v.join("=")];
      })
    );
    return cookies;
  } else {
    return null;
  }

  // access with name EXAMPLE:
  // const accessToken = cookies["access_token"];
};
