import { redirect } from "@remix-run/server-runtime";
import { prisma } from "~/db.server";
import { includeBlocksData } from "~/utility/blockMaster";
import { getOrderBy } from "~/helpers/sortHelpers";
import { getBlocks } from "~/helpers/blockHelpers";
import { removeBlock } from "./pageBuilder.server";

export const getWebPage = async (id?: string, title?: string) => {
  let whereClause;

  if (id) {
    whereClause = { id: parseInt(id) };
  } else if (title) {
    whereClause = { title: title };
  } else {
    throw new Error("Either id or name must be specified");
  }

  return await prisma.webPage.findUnique({
    where: whereClause,
    include: {
      blocks: includeBlocksData,
      thumbnail: true,
    },
  });
};

export const deleteWebPage = async (id: number) => {
  const webPage = await prisma.webPage.findUnique({
    where: {
      id,
    },
    include: {
      blocks: {
        include: {
          bannerBlock: true,
          tileBlock: true,
          textBlock: true,
          productBlock: true,
          articleBlock: true,
          blockOptions: true,
        },
      },
    },
  });

  if (!webPage) {
    return false;
  }

  //find and delete the associated blocks
  const webPageBlocks = await getBlocks(webPage as any);

  webPageBlocks.map((e: Block) => removeBlock(e.id, e.name));

  // Delete the webPage
  await prisma.webPage.delete({
    where: {
      id,
    },
  });

  return redirect("/admin/pages");
};

export const searchWebPages = async (
  formData?: { [k: string]: FormDataEntryValue },
  url?: URL
) => {
  const title =
    formData?.title || (url && url.searchParams.get("title")?.toString()) || "";
  const sortBy = formData?.sortBy || url?.searchParams.get("sortBy") || "";
  const sortOrder =
    formData?.sortOrder || url?.searchParams.get("sortOrder") || "";
  const pageNumber =
    (formData?.pageNumber && parseInt(formData.pageNumber as string)) ||
    (url && Number(url.searchParams.get("pageNumber"))) ||
    1;
  const perPage =
    (formData?.perPage && parseInt(formData.perPage as string)) ||
    (url && Number(url.searchParams.get("perPage"))) ||
    10;

  const skip = (pageNumber - 1) * perPage;
  const take = perPage;

  // Construct a filter based on the search parameters provided
  const filter: { [key: string]: any } = {};

  if (title) {
    filter.title = {
      contains: title,
      mode: "insensitive",
    };
  }

  // Find and count the webPages
  const [webPages, totalWebPages] = await Promise.all([
    prisma.webPage.findMany({
      where: filter,
      include: {
        thumbnail: true,
      },
      skip,
      take,
      orderBy: getOrderBy(sortBy as SortBy, sortOrder as SortOrder),
    }),
    prisma.webPage.count({
      where: filter,
    }),
  ]);

  const totalPages = Math.ceil(totalWebPages / perPage);

  return { webPages, totalPages };
};
