import { prisma } from "~/db.server";

const updateOrCreateBlockOptions = async (
  blockId: string,
  blockOptions: NewBlockOptions
): Promise<void> => {
  let existingBlockOptions;

  existingBlockOptions = await prisma.blockOptions.findFirst({
    where: { block: { id: blockId } },
  });

  if (existingBlockOptions) {
    await prisma.blockOptions.update({
      where: { id: existingBlockOptions.id },
      data: blockOptions,
    });
  } else {
    await prisma.blockOptions.create({
      data: { block: { connect: { id: blockId } }, ...blockOptions },
    });
  }
};

export const updatePageBlock = async (
  pageType: "homePage" | "webPage" | "article",
  pageId: number,
  blockData: NewBlockData,
  blockOptions?: NewBlockOptions
): Promise<number | HomePage | Article> => {
  const {
    blockName,
    itemIndex,
    contentType,
    contentData,
    stringData,
    objectData,
  } = blockData;

  let page;

  if (pageType === "homePage") {
    page = await prisma.homePage.findUnique({
      where: { id: pageId },
    });
  } else if (pageType === "webPage") {
    page = await prisma.webPage.findUnique({
      where: { id: pageId },
    });
  } else if (pageType === "article") {
    page = await prisma.article.findUnique({
      where: { id: pageId },
    });
  } else {
    throw new Error(`Invalid page type: ${pageType}`);
  }

  if (!page) {
    throw new Error(`Page not found for pageId: ${pageId}`);
  }

  const blocks = await prisma.block.findMany({
    where: { [`${pageType}Id`]: page.id },
    orderBy: { order: "asc" },
    include: {
      bannerBlock: true,
      tileBlock: {
        include: {
          campaigns: true,
          promotions: true,
          contentImages: true,
        },
      },
      textBlock: true,
      productBlock: true,
      articleBlock: true,
    },
  });

  const isValidItemIndex = itemIndex >= 0 && itemIndex <= blocks.length;
  if (!isValidItemIndex) {
    throw new Error(`Invalid itemIndex: ${itemIndex}`);
  }

  const blockToUpdate = blocks.find((e) => e.order === itemIndex);
  if (blockToUpdate) {
    if (blockName === "banner" && contentData) {
      const bannerBlock = blockToUpdate.bannerBlock;
      if (bannerBlock) {
        // Disconnect existing promotions and campaigns
        await prisma.bannerBlock.update({
          where: { id: bannerBlock.id },
          data: {
            promotion: { disconnect: true },
            campaign: { disconnect: true },
            contentImage: { disconnect: true },
          },
        });

        const updatedBannerBlock = await prisma.bannerBlock.update({
          where: { id: bannerBlock.id },
          data: {
            type: contentType,
            promotion:
              contentType === "promotion"
                ? { connect: { id: contentData[0].id } }
                : undefined,
            campaign:
              contentType === "campaign"
                ? { connect: { id: contentData[0].id } }
                : undefined,
            contentImage:
              contentType === "image"
                ? { connect: { id: contentData[0].id } }
                : undefined,
          },
        });

        await prisma.block.update({
          where: { id: blockToUpdate.id },
          data: {
            order: itemIndex === 0 ? 0 : itemIndex,
            bannerBlock: { connect: { id: updatedBannerBlock.id } },

            textBlock: { disconnect: true },
            tileBlock: { disconnect: true },
            articleBlock: { disconnect: true },
            productBlock: { disconnect: true },
          },
        });
      }
    } else if (blockName === "tile" && contentData) {
      const tileBlock = blockToUpdate.tileBlock;
      if (tileBlock) {
        // Find the current connected content to disconnect them
        const existingPromotions = tileBlock.promotions.map((p) => ({
          id: p.id,
        }));
        const existingCampaigns = tileBlock.campaigns.map((c) => ({
          id: c.id,
        }));
        const existingContentImages = tileBlock.contentImages.map((c) => ({
          id: c.id,
        }));

        // Disconnect existing content
        await prisma.tileBlock.update({
          where: { id: tileBlock.id },
          data: {
            promotions: { disconnect: existingPromotions },
            campaigns: { disconnect: existingCampaigns },
            contentImages: { disconnect: existingContentImages },
          },
        });

        // Fetch the updated tileBlock with content
        const updatedTileBlock = await prisma.tileBlock.update({
          where: { id: tileBlock.id },
          data: {
            type: contentType,
            promotions:
              contentType === "promotion"
                ? { connect: contentData.map((p) => ({ id: p.id })) }
                : undefined,
            campaigns:
              contentType === "campaign"
                ? { connect: contentData.map((c) => ({ id: c.id })) }
                : undefined,
            contentImages:
              contentType === "image"
                ? { connect: contentData.map((c) => ({ id: c.id })) }
                : undefined,
          },
          // Fetch the promotions field along with other necessary fields
          select: {
            id: true,
            name: true,
            type: true,
            createdAt: true,
            updatedAt: true,
            promotions: true,
            campaigns: true,
            contentImages: true,
          },
        });

        // Update the block to connect to the updated tileBlock and disconnect the bannerBlock
        await prisma.block.update({
          where: { id: blockToUpdate.id },
          data: {
            order: itemIndex === 0 ? 0 : itemIndex,
            tileBlock: { connect: { id: updatedTileBlock.id } },

            bannerBlock: { disconnect: true },
            textBlock: { disconnect: true },
            productBlock: { disconnect: true },
            articleBlock: { disconnect: true },
          },
        });
      }
    } else if (blockName === "text" && stringData) {
      const textBlock = blockToUpdate.textBlock;
      if (textBlock) {
        const updatedTextBlock = await prisma.textBlock.update({
          where: { id: textBlock.id },
          data: { content: [stringData] },
        });

        await prisma.block.update({
          where: { id: blockToUpdate.id },
          data: {
            order: itemIndex === 0 ? 0 : itemIndex,
            textBlock: { connect: { id: updatedTextBlock.id } },

            bannerBlock: { disconnect: true },
            tileBlock: { disconnect: true },
            productBlock: { disconnect: true },
            articleBlock: { disconnect: true },
          },
        });
      }
    } else if (blockName === "product" && objectData) {
      const productBlock = blockToUpdate.productBlockId;

      const productBlockContent = await prisma.productBlockContent.findFirst({
        where: { productBlockId: blockToUpdate.productBlockId },
      });

      const { productCategory, productSubCategory, brand } =
        objectData as NewProductBlockContent;

      if (productBlock && productBlockContent) {
        const updatedProductBlockContent =
          await prisma.productBlockContent.update({
            where: { id: productBlockContent.id },
            data: {
              productCategory: productCategory
                ? { connect: { id: parseInt(productCategory) } }
                : { disconnect: true },
              productSubCategory: productSubCategory
                ? { connect: { id: parseInt(productSubCategory) } }
                : { disconnect: true },
              brand: brand
                ? { connect: { id: parseInt(brand) } }
                : { disconnect: true },
            },
          });

        const updatedProductBlock = await prisma.productBlock.update({
          where: { id: productBlock },
          data: {
            content: { connect: { id: updatedProductBlockContent.id } },
          },
        });

        await prisma.block.update({
          where: { id: blockToUpdate.id },
          data: {
            order: itemIndex === 0 ? 0 : itemIndex,
            productBlock: { connect: { id: updatedProductBlock.id } },

            bannerBlock: { disconnect: true },
            tileBlock: { disconnect: true },
            textBlock: { disconnect: true },
            articleBlock: { disconnect: true },
          },
        });
      }
    } else if (blockName === "article" && objectData) {
      const articleBlock = blockToUpdate.articleBlockId;

      const articleBlockContent = await prisma.articleBlockContent.findFirst({
        where: { articleBlockId: blockToUpdate.articleBlockId },
      });

      const { articleCategory } = objectData as NewArticleBlockContent;

      if (articleBlock && articleBlockContent) {
        const updatedArticleBlockContent =
          await prisma.articleBlockContent.update({
            where: { id: articleBlockContent.id },
            data: {
              articleCategory: articleCategory
                ? { connect: { id: parseInt(articleCategory) } }
                : { disconnect: true },
            },
          });

        const updatedArticleBlock = await prisma.articleBlock.update({
          where: { id: articleBlock },
          data: {
            content: { connect: { id: updatedArticleBlockContent.id } },
          },
        });

        await prisma.block.update({
          where: { id: blockToUpdate.id },
          data: {
            order: itemIndex === 0 ? 0 : itemIndex,
            articleBlock: { connect: { id: updatedArticleBlock.id } },

            bannerBlock: { disconnect: true },
            tileBlock: { disconnect: true },
            textBlock: { disconnect: true },
            productBlock: { disconnect: true },
          },
        });
      }
    } else {
      await deleteBlockIfInvalid(blockToUpdate.id);
      throw new Error(`Invalid type: ${blockName}`);
    }

    // update with new block options
    if (blockOptions) {
      await updateOrCreateBlockOptions(blockToUpdate.id, blockOptions);
    }
  } else {
    const newBlock = await prisma.block.create({
      data: {
        order: itemIndex === 0 ? 0 : itemIndex,
        [`${pageType}`]: { connect: { id: page.id } },
      },
    });

    // create block options for new block
    if (blockOptions) {
      await updateOrCreateBlockOptions(newBlock.id, blockOptions);
    }

    if (blockName === "banner" && contentData) {
      if (contentType === "promotion") {
        await prisma.bannerBlock.create({
          data: {
            type: contentType,
            promotion: { connect: { id: contentData[0].id } },
            block: { connect: { id: newBlock.id } },
          },
        });
      } else if (contentType === "campaign" && contentData) {
        await prisma.bannerBlock.create({
          data: {
            type: contentType,
            campaign: { connect: { id: contentData[0].id } },
            block: { connect: { id: newBlock.id } },
          },
        });
      }
      ///////////////////////////////////////////
      ///////////////////////////////////////////
      ///////////////////////////////////////////
      ///////////////////////////////////////////
      ///////////////////////////////////////////
      ///////////////////////////////////////////
      else if (contentType === "image" && contentData) {
        const { href, image } = contentData[0] as ContentImage;

        // Create a new ProductBlock with the new ProductBlockContent
        const newContentImage = await prisma.contentImage.create({
          data: {
            href: href,
            image: { connect: { id: image.id } },
          },
        });

        await prisma.bannerBlock.create({
          data: {
            type: contentType,
            contentImage: { connect: { id: newContentImage.id } },
            block: { connect: { id: newBlock.id } },
          },
        });
      }
      ///////////////////////////////////////////
      ///////////////////////////////////////////
      ///////////////////////////////////////////
      ///////////////////////////////////////////
      ///////////////////////////////////////////
      ///////////////////////////////////////////
      else {
        await deleteBlockIfInvalid(newBlock.id);
        throw new Error(`Invalid data type: ${contentType}`);
      }
    } else if (blockName === "tile" && contentData) {
      if (contentType === "promotion") {
        await prisma.tileBlock.create({
          data: {
            type: contentType,
            promotions: {
              connect: contentData.map((p) => ({ id: p.id })),
            },
            block: { connect: { id: newBlock.id } },
          },
        });
      } else if (contentType === "campaign" && contentData) {
        await prisma.tileBlock.create({
          data: {
            type: contentType,
            campaigns: {
              connect: contentData.map((c) => ({ id: c.id })),
            },
            block: { connect: { id: newBlock.id } },
          },
        });
      }

      ///////////////////////////////////////////
      ///////////////////////////////////////////
      ///////////////////////////////////////////
      ///////////////////////////////////////////
      ///////////////////////////////////////////
      ///////////////////////////////////////////
      else if (contentType === "image" && contentData) {
        const imagesToCreate = contentData as ContentImage[];

        const createdContentImages: ContentImage[] = [];
        for (const item of imagesToCreate) {
          const createdContentImage = await prisma.contentImage.create({
            data: {
              href: item.href,
              image: { connect: { id: item.image.id } },
            },
            include: {
              image: true,
            },
          });

          createdContentImages.push(createdContentImage as ContentImage);
        }

        await prisma.tileBlock.create({
          data: {
            type: contentType,
            contentImages: {
              connect: createdContentImages.map((c) => ({ id: c.id })),
            },
            block: { connect: { id: newBlock.id } },
          },
        });
      }

      ///////////////////////////////////////////
      ///////////////////////////////////////////
      ///////////////////////////////////////////
      ///////////////////////////////////////////
      ///////////////////////////////////////////
      ///////////////////////////////////////////
      else {
        await deleteBlockIfInvalid(newBlock.id);
        throw new Error(`Invalid data type: ${contentType}`);
      }
    } else if (blockName === "text" && stringData) {
      const newTextBlock = await prisma.textBlock.create({
        data: {
          content: [stringData],
          block: { connect: { id: newBlock.id } },
        },
      });

      await prisma.block.update({
        where: { id: newBlock.id },
        data: {
          order: itemIndex === 0 ? 0 : itemIndex,
          textBlock: { connect: { id: newTextBlock.id } },

          bannerBlock: { disconnect: true },
          tileBlock: { disconnect: true },
          productBlock: { disconnect: true },
          articleBlock: { disconnect: true },
        },
      });
    } else if (blockName === "product" && objectData) {
      const { productCategory, productSubCategory, brand } =
        objectData as NewProductBlockContent;

      // Create a new ProductBlock with the new ProductBlockContent
      const newProductBlockContent = await prisma.productBlockContent.create({
        data: {
          productCategory: productCategory
            ? { connect: { id: parseInt(productCategory) } }
            : undefined,
          productSubCategory: productSubCategory
            ? { connect: { id: parseInt(productSubCategory) } }
            : undefined,
          brand: brand ? { connect: { id: parseInt(brand) } } : undefined,
        },
      });

      const newProductBlock = await prisma.productBlock.create({
        data: {
          name: "product",
          block: { connect: { id: newBlock.id } },
          content: { connect: { id: newProductBlockContent.id } },
        },
      });

      await prisma.block.update({
        where: { id: newBlock.id },
        data: {
          order: itemIndex === 0 ? 0 : itemIndex,
          productBlock: { connect: { id: newProductBlock.id } },

          bannerBlock: { disconnect: true },
          tileBlock: { disconnect: true },
          textBlock: { disconnect: true },
          articleBlock: { disconnect: true },
        },
      });
    } else if (blockName === "article" && objectData) {
      const { articleCategory } = objectData as NewArticleBlockContent;

      // Create a new ArticleBlock with the new ArticleBlockContent
      const newArticleBlockContent = await prisma.articleBlockContent.create({
        data: {
          articleCategory: articleCategory
            ? { connect: { id: parseInt(articleCategory) } }
            : undefined,
        },
      });

      const newArticleBlock = await prisma.articleBlock.create({
        data: {
          name: "article",
          block: { connect: { id: newBlock.id } },
          content: { connect: { id: newArticleBlockContent.id } },
        },
      });

      await prisma.block.update({
        where: { id: newBlock.id },
        data: {
          order: itemIndex === 0 ? 0 : itemIndex,
          articleBlock: { connect: { id: newArticleBlock.id } },

          productBlock: { disconnect: true },
          bannerBlock: { disconnect: true },
          tileBlock: { disconnect: true },
          textBlock: { disconnect: true },
        },
      });
    } else {
      await deleteBlockIfInvalid(newBlock.id);
      throw new Error(`Invalid type: ${blockName}`);
    }
  }

  if (pageType === "article") {
    return page.id;
  } else return page as HomePage;
};

export const changeBlockOrder = async (
  pageType: "homePage" | "webPage" | "article",
  pageId: number,
  index: number,
  direction: "up" | "down"
) => {
  let blockToMove;

  if (pageType === "homePage") {
    blockToMove = await prisma.block.findFirst({
      where: { homePageId: pageId },
      orderBy: { order: "asc" },
      skip: index,
      take: 1,
    });
  } else if (pageType === "webPage") {
    blockToMove = await prisma.block.findFirst({
      where: { webPageId: pageId },
      orderBy: { order: "asc" },
      skip: index,
      take: 1,
    });
  } else if (pageType === "article") {
    blockToMove = await prisma.block.findFirst({
      where: { articleId: pageId },
      orderBy: { order: "asc" },
      skip: index,
      take: 1,
    });
  } else {
    throw new Error(`Invalid page type: ${pageType}`);
  }

  if (!blockToMove) {
    throw new Error(`Block not found at index ${index}`);
  }

  let maxIndex;

  if (pageType === "homePage") {
    maxIndex =
      (await prisma.block.count({ where: { homePageId: pageId } })) - 1;
  } else if (pageType === "webPage") {
    maxIndex = (await prisma.block.count({ where: { webPageId: pageId } })) - 1;
  } else if (pageType === "article") {
    maxIndex = (await prisma.block.count({ where: { articleId: pageId } })) - 1;
  }

  let newOrder: number;
  if (direction === "up") {
    newOrder = blockToMove.order - 1;
    if (newOrder < 0) {
      newOrder = 0;
    }
  } else if (direction === "down" && maxIndex) {
    newOrder = blockToMove.order + 1;
    if (newOrder > maxIndex) {
      newOrder = maxIndex;
    }
  } else {
    throw new Error(`Invalid direction: ${direction}`);
  }

  if (pageType === "homePage") {
    await prisma.$transaction([
      prisma.block.update({
        where: { id: blockToMove.id },
        data: { order: newOrder },
      }),
      prisma.block.updateMany({
        where: {
          homePageId: pageId,
          id: { not: blockToMove.id },
          order:
            direction === "up"
              ? { gte: newOrder, lte: blockToMove.order }
              : { lte: newOrder, gte: blockToMove.order },
        },
        data: {
          order: {
            [direction === "up" ? "increment" : "decrement"]: 1,
          },
        },
      }),
    ]);
  } else if (pageType === "webPage") {
    await prisma.$transaction([
      prisma.block.update({
        where: { id: blockToMove.id },
        data: { order: newOrder },
      }),
      prisma.block.updateMany({
        where: {
          webPageId: pageId,
          id: { not: blockToMove.id },
          order:
            direction === "up"
              ? { gte: newOrder, lte: blockToMove.order }
              : { lte: newOrder, gte: blockToMove.order },
        },
        data: {
          order: {
            [direction === "up" ? "increment" : "decrement"]: 1,
          },
        },
      }),
    ]);
  } else if (pageType === "article") {
    await prisma.$transaction([
      prisma.block.update({
        where: { id: blockToMove.id },
        data: { order: newOrder },
      }),
      prisma.block.updateMany({
        where: {
          articleId: pageId,
          id: { not: blockToMove.id },
          order:
            direction === "up"
              ? { gte: newOrder, lte: blockToMove.order }
              : { lte: newOrder, gte: blockToMove.order },
        },
        data: {
          order: {
            [direction === "up" ? "increment" : "decrement"]: 1,
          },
        },
      }),
    ]);
  }

  return true;
};

export const removeBlock = async (pageId: number, itemIndex: number) => {
  let page;
  let blocks;

  // Check if the pageId corresponds to a HomePage or an Article
  const isHomePage = await prisma.homePage.findUnique({
    where: { id: pageId },
  });
  const isWebPage = await prisma.webPage.findUnique({
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
      include: {
        bannerBlock: true,
        tileBlock: {
          include: {
            contentImages: true,
          },
        },
        textBlock: true,
        productBlock: {
          include: {
            content: true,
          },
        },
        articleBlock: {
          include: {
            content: true,
          },
        },
        blockOptions: true,
      },
    });
  } else if (isWebPage) {
    page = isWebPage;
    blocks = await prisma.block.findMany({
      where: { webPageId: page.id },
      orderBy: { order: "asc" },
      include: {
        bannerBlock: true,
        tileBlock: {
          include: {
            contentImages: true,
          },
        },
        textBlock: true,
        productBlock: {
          include: {
            content: true,
          },
        },
        articleBlock: {
          include: {
            content: true,
          },
        },
        blockOptions: true,
      },
    });
  } else if (isArticlePage) {
    page = isArticlePage;
    blocks = await prisma.block.findMany({
      where: { articleId: page.id },
      orderBy: { order: "asc" },
      include: {
        bannerBlock: true,
        tileBlock: {
          include: {
            contentImages: true,
          },
        },
        textBlock: true,
        productBlock: {
          include: {
            content: true,
          },
        },
        articleBlock: {
          include: {
            content: true,
          },
        },
        blockOptions: true,
      },
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

  if (blockToRemove.blockOptions) {
    // Delete the blockOptions associated with the block
    await prisma.blockOptions.delete({
      where: { id: blockToRemove.blockOptions.id },
    });
  }

  const transaction = [];

  if (blockToRemove.bannerBlock) {
    const deleteBannerBlockPromise = prisma.bannerBlock.delete({
      where: { id: blockToRemove.bannerBlock.id },
    });
    transaction.push(deleteBannerBlockPromise);

    if (blockToRemove.bannerBlock.contentImageId) {
      const deleteContentImagePromise = prisma.contentImage.delete({
        where: { id: blockToRemove.bannerBlock.contentImageId },
      });
      transaction.push(deleteContentImagePromise);
    }
  }

  if (blockToRemove.tileBlock) {
    const deleteTileBlockPromise = prisma.tileBlock.delete({
      where: { id: blockToRemove.tileBlock.id },
    });
    transaction.push(deleteTileBlockPromise);

    if (blockToRemove.tileBlock.contentImages) {
      const contentImageIdsToDelete = blockToRemove.tileBlock.contentImages.map(
        (e) => e.id
      );

      const deleteContentImagePromise = prisma.contentImage.deleteMany({
        where: {
          id: {
            in: contentImageIdsToDelete,
          },
        },
      });

      transaction.push(deleteContentImagePromise);
    }
  }

  if (blockToRemove.textBlock) {
    const deleteTextBlockPromise = prisma.textBlock.delete({
      where: { id: blockToRemove.textBlock.id },
    });
    transaction.push(deleteTextBlockPromise);
  }

  if (blockToRemove.productBlock) {
    const deleteProductBlockPromise = prisma.productBlock.delete({
      where: { id: blockToRemove.productBlock.id },
    });
    transaction.push(deleteProductBlockPromise);

    if (blockToRemove.productBlock.content) {
      const deleteProductBlockContentPromise =
        prisma.productBlockContent.delete({
          where: { id: blockToRemove.productBlock.content.id },
        });
      transaction.push(deleteProductBlockContentPromise);
    }
  }

  if (blockToRemove.articleBlock) {
    const deleteArticleBlockPromise = prisma.articleBlock.delete({
      where: { id: blockToRemove.articleBlock.id },
    });
    transaction.push(deleteArticleBlockPromise);

    if (blockToRemove.articleBlock.content) {
      const deleteArticleBlockContentPromise =
        prisma.articleBlockContent.delete({
          where: { id: blockToRemove.articleBlock.content.id },
        });
      transaction.push(deleteArticleBlockContentPromise);
    }
  }

  const deleteBlockPromise = prisma.block.delete({
    where: { id: blockToRemove.id },
  });
  transaction.push(deleteBlockPromise);

  await prisma.$transaction(transaction);

  // Only update 'order' property of blocks that come after the removed one
  const itemsToUpdate = blocks.slice(itemIndex + 1);

  const updatePromises = itemsToUpdate.map((item) =>
    prisma.block.update({
      where: { id: item.id },
      data: { order: item.order - 1 },
    })
  );

  await prisma.$transaction(updatePromises);

  return true;
};

export const deleteBlockIfInvalid = async (blockId: string) => {
  const block = await prisma.block.findUnique({
    where: { id: blockId },
    include: {
      bannerBlock: true,
      tileBlock: true,
      textBlock: true,
      productBlock: true,
      articleBlock: true,
      blockOptions: true,
    },
  });

  if (
    block &&
    !block.tileBlock &&
    !block.textBlock &&
    !block.productBlock &&
    !block.articleBlock &&
    !block.bannerBlock
  ) {
    if (block.blockOptionsId) {
      await prisma.blockOptions.delete({ where: { id: block.blockOptionsId } });
    }
    await prisma.block.delete({ where: { id: blockId } });
  } else {
    console.error("Block has associated blocks and cannot be deleted.");
  }
};
