export const getParentPageName = (req: Request) => {
  const url = new URL(req.url);

  const splitPathname = url.pathname.split("/");

  return splitPathname[splitPathname?.length - 2];
};
