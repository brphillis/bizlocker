import type { WebPage } from "@prisma/client";
import { type BlockWithContent, disconnectBlock } from "./pageBuilder.server";
import { type TypedResponse, redirect } from "@remix-run/server-runtime";
import { prisma } from "~/db.server";
import { activeContentTypes } from "~/utility/blockMaster/blockMaster";
import { getOrderBy } from "~/helpers/sortHelpers";
import { getBlocks } from "~/helpers/blockHelpers";

export const getWebPage = async (
  id?: string,
  title?: string
): Promise<WebPage | null> => {
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
      blocks: {
        include: {
          blockOptions: true,
          content: {
            include: activeContentTypes,
          },
        },
      },
      thumbnail: true,
    },
  });
};

export const deleteWebPage = async (
  id: number
): Promise<TypedResponse<void>> => {
  const webPage = await prisma.webPage.findUnique({
    where: {
      id,
    },
    include: {
      blocks: {
        include: {
          blockOptions: true,
          content: { include: activeContentTypes },
        },
      },
    },
  });

  if (!webPage) {
    throw new Error("WebPage Not Found");
  }

  //find and delete the associated blocks
  const webPageBlocks = await getBlocks(webPage as any);

  await Promise.all(
    webPageBlocks.map(
      async (e: BlockWithContent) => await disconnectBlock(e.id, e.name)
    )
  );

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
): Promise<{ webPages: WebPage[]; totalPages: number }> => {
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
