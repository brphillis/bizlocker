import { getSiteMap } from "~/models/SiteMap/index.server";
export const loader = async () => {
  // handle "GET" request
  // separating xml content from Response to keep clean code.

  const sitemap = await getSiteMap();

  let content = "";

  if (sitemap) {
    content = sitemap.value;
  } else {
    throw new Response(null, {
      status: 404,
      statusText: "Page Not Found",
    });
  }

  // Return the response with the content, a status 200 message, and the appropriate headers for an XML page
  return new Response(content, {
    status: 200,
    headers: {
      "Content-Type": "application/xml",
      "xml-version": "1.0",
      encoding: "UTF-8",
    },
  });
};
