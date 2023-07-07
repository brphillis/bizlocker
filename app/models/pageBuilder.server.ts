import { prisma } from "~/db.server";

export const removeBlock = async (pageId: number, itemIndex: number) => {
  let page;
  let blocks;

  // Check if the pageId corresponds to a HomePage or an Article
  const isHomePage = await prisma.homePage.findUnique({
    where: { id: pageId },
  });
  const isArticlePage = await prisma.article.findUnique({
    where: { id: pageId },
  });

  if (isHomePage) {
    page = isHomePage;
    blocks = await prisma.block.findMany({
      where: { homePageId: page.id },
      orderBy: { order: "asc" },
      include: { bannerBlock: true, tileBlock: true, textBlock: true },
    });
  } else if (isArticlePage) {
    page = isArticlePage;
    blocks = await prisma.block.findMany({
      where: { articleId: page.id },
      orderBy: { order: "asc" },
      include: { bannerBlock: true, tileBlock: true, textBlock: true },
    });
  } else {
    throw new Error(`Page not found for pageId: ${pageId}`);
  }

  if (itemIndex === 0) {
    throw new Error("Cannot remove item at index 0");
  }

  const isValidItemIndex = itemIndex >= 0 && itemIndex < blocks.length;

  if (!isValidItemIndex) {
    throw new Error(`Invalid itemIndex: ${itemIndex}`);
  }

  const blockToRemove = blocks[itemIndex];

  const transaction = [];

  if (blockToRemove.bannerBlock) {
    const deleteBannerBlockPromise = prisma.bannerBlock.delete({
      where: { id: blockToRemove.bannerBlock.id },
    });
    transaction.push(deleteBannerBlockPromise);
  }

  if (blockToRemove.tileBlock) {
    const deleteTileBlockPromise = prisma.tileBlock.delete({
      where: { id: blockToRemove.tileBlock.id },
    });
    transaction.push(deleteTileBlockPromise);
  }

  if (blockToRemove.textBlock) {
    const deleteTextBlockPromise = prisma.textBlock.delete({
      where: { id: blockToRemove.textBlock.id },
    });
    transaction.push(deleteTextBlockPromise);
  }

  const deleteBlockPromise = prisma.block.delete({
    where: { id: blockToRemove.id },
  });

  transaction.push(deleteBlockPromise);

  await prisma.$transaction(transaction);

  // Only update 'order' property of blocks that come after the removed one
  const itemsToUpdate = blocks.slice(itemIndex + 1);

  const updatePromises = itemsToUpdate.map((item, i) =>
    prisma.block.update({
      where: { id: item.id },
      data: { order: item.order - 1 },
    })
  );

  await prisma.$transaction(updatePromises);

  return true;
};
