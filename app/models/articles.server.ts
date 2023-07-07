import { prisma } from "~/db.server";

export const getArticle = async (id?: string, title?: string) => {
  let whereClause;

  if (id) {
    whereClause = { id: parseInt(id) };
  } else if (title) {
    whereClause = { title: title };
  } else {
    throw new Error("Either id or name must be specified");
  }

  return await prisma.article.findUnique({
    where: whereClause,
    include: {
      blocks: {
        include: {
          bannerBlock: {
            include: {
              campaign: {
                include: {
                  bannerImage: true,
                  tileImage: true,
                },
              },
              promotion: {
                include: {
                  bannerImage: true,
                  tileImage: true,
                },
              },
            },
          },
          tileBlock: {
            include: {
              campaigns: {
                include: {
                  bannerImage: true,
                  tileImage: true,
                },
              },
              promotions: {
                include: {
                  bannerImage: true,
                  tileImage: true,
                },
              },
            },
          },
          textBlock: true,
        },
      },
      articleCategories: {
        select: {
          id: true,
          name: true,
        },
      },
      thumbnail: true,
    },
  });
};

export const upsertArticleInfo = async (
  title: string,
  articleCategories: string[],
  thumbnail: Image,
  articleId?: number
) => {
  let article;

  if (!articleId) {
    article = await prisma.article.create({
      // Provide the desired properties for the new article
      data: {
        title: title,
        articleCategories: {
          connect: articleCategories.map((category: string) => ({
            name: category,
          })),
        },
        thumbnail: {
          create: {
            url: thumbnail.url,
            altText: thumbnail.altText,
          },
        },
      },
    });
  } else {
    // Retrieve the article by articleId
    article = await prisma.article.findUnique({
      where: {
        id: articleId,
      },
    });

    if (!article) {
      throw new Error(`Article not found for articleId: ${articleId}`);
    }

    // Disconnect the existing categories from the article
    await prisma.article.update({
      where: { id: articleId },
      data: {
        articleCategories: { set: [] },
      },
    });

    // Update the existing article's title and thumbnail
    article = await prisma.article.update({
      where: {
        id: article.id,
      },
      data: {
        title: title,
        articleCategories: {
          connect: articleCategories.map((category: string) => ({
            name: category,
          })),
        },
        thumbnail: {
          update: {
            url: thumbnail.url,
            altText: thumbnail.altText,
          },
        },
      },
    });
  }

  return article.id;
};

export const updateArticleBlocks = async (
  itemIndex: number,
  blockName: BlockName,
  articleId: number,
  contentType?: BlockContentType,
  contentData?: Promotion[] | Campaign[],
  stringData?: string
) => {
  let article;

  // If articleId is not provided, create a new article
  if (!articleId) {
    article = await prisma.article.create({
      // Provide the desired properties for the new article
      data: {
        title: "Untitled",
      },
    });
  } else {
    // Retrieve the article by articleId
    article = await prisma.article.findUnique({
      where: {
        id: articleId,
      },
    });

    if (!article) {
      throw new Error(`Article not found for articleId: ${articleId}`);
    }
  }

  // Retrieve the blocks associated with the page
  const blocks = await prisma.block.findMany({
    where: {
      articleId: article.id,
    },
    orderBy: {
      order: "asc",
    },
    include: {
      bannerBlock: true,
      tileBlock: true,
      textBlock: true,
    },
  });

  // Check if the itemIndex is within the range of available blocks or one position after the last item
  const isValidItemIndex = itemIndex >= 0 && itemIndex <= blocks.length;

  if (!isValidItemIndex) {
    throw new Error(`Invalid itemIndex: ${itemIndex}`);
  }

  const blockToUpdate = blocks.find((e) => e.order === itemIndex);

  if (blockToUpdate) {
    if (blockName === "banner") {
      // Retrieve the existing BannerBlock
      const bannerBlock = blockToUpdate.bannerBlock;

      if (bannerBlock) {
        // Disconnect all existing data from BannerBlock
        await prisma.bannerBlock.update({
          where: {
            id: bannerBlock.id,
          },
          data: {
            promotion: {
              disconnect: true,
            },
            campaign: {
              disconnect: true,
            },
          },
        });

        if (contentType === "promotion" && contentData) {
          // Update the BannerBlock with the new promotion
          const updatedBannerBlock = await prisma.bannerBlock.update({
            where: {
              id: bannerBlock.id,
            },
            data: {
              type: contentType,
              promotion: {
                connect: {
                  id: contentData[0].id,
                },
              },
            },
          });

          // Update the blocks with the updated BannerBlock and itemOrder
          await prisma.block.update({
            where: {
              id: blockToUpdate.id,
            },
            data: {
              order: itemIndex === 0 ? 0 : itemIndex,
              bannerBlock: {
                connect: {
                  id: updatedBannerBlock.id,
                },
              },
              tileBlock: {
                disconnect: true,
              },
            },
          });
        } else if (contentType === "campaign" && contentData) {
          // Update the BannerBlock with the new campaign
          const updatedBannerBlock = await prisma.bannerBlock.update({
            where: {
              id: bannerBlock.id,
            },
            data: {
              type: contentType,
              campaign: {
                connect: {
                  id: contentData[0].id,
                },
              },
            },
          });

          // Update the block with the updated BannerBlock and itemOrder
          await prisma.block.update({
            where: {
              id: blockToUpdate.id,
            },
            data: {
              order: itemIndex === 0 ? 0 : itemIndex,
              bannerBlock: {
                connect: {
                  id: updatedBannerBlock.id,
                },
              },
              tileBlock: {
                disconnect: true,
              },
            },
          });
        }
      }
    } else if (blockName === "tile" && contentData) {
      // Retrieve the existing TileBlock
      const tileBlock = blockToUpdate.tileBlock;

      if (tileBlock) {
        // Disconnect all existing data from the TileBlock
        await prisma.tileBlock.update({
          where: {
            id: tileBlock.id,
          },
          data: {
            promotions: undefined,
            campaigns: undefined,
          },
        });

        if (contentType === "promotion") {
          // Update the TileBlock with the new promotion
          const updatedTileBlock = await prisma.tileBlock.update({
            where: {
              id: tileBlock.id,
            },
            data: {
              type: contentType,
              promotions: {
                connect: contentData.map((promotion) => ({ id: promotion.id })),
              },
            },
          });

          // Update the block with the updated TileBlock and itemOrder
          await prisma.block.update({
            where: {
              id: blockToUpdate.id,
            },
            data: {
              order: itemIndex === 0 ? 0 : itemIndex,
              tileBlock: {
                connect: {
                  id: updatedTileBlock.id,
                },
              },
              bannerBlock: {
                disconnect: true,
              },
            },
          });
        } else if (contentType === "campaign" && contentData) {
          // Update the TileBlock with the new campaign
          const updatedTileBlock = await prisma.tileBlock.update({
            where: {
              id: tileBlock.id,
            },
            data: {
              type: contentType,
              campaigns: {
                connect: contentData.map((campaign) => ({ id: campaign.id })),
              },
            },
          });

          // Update the block with the updated TileBlock and itemOrder
          await prisma.block.update({
            where: {
              id: blockToUpdate.id,
            },
            data: {
              order: itemIndex === 0 ? 0 : itemIndex,
              tileBlock: {
                connect: {
                  id: updatedTileBlock.id,
                },
              },
              bannerBlock: {
                disconnect: true,
              },
            },
          });
        }
      }
    } else if (blockName === "text" && stringData) {
      // Retrieve the existing TextBlock
      const textBlock = blockToUpdate.textBlock;

      if (textBlock) {
        // Update the TextBlock with the new content
        const updatedTextBlock = await prisma.textBlock.update({
          where: {
            id: textBlock.id,
          },
          data: {
            content: [stringData],
          },
        });

        // Update the block with the updated TextBlock and itemOrder
        await prisma.block.update({
          where: {
            id: blockToUpdate.id,
          },
          data: {
            order: itemIndex === 0 ? 0 : itemIndex,
            textBlock: {
              connect: {
                id: updatedTextBlock.id,
              },
            },
            bannerBlock: {
              disconnect: true,
            },
            tileBlock: {
              disconnect: true,
            },
          },
        });
      }
    } else {
      throw new Error(`Invalid type: ${blockName}`);
    }
  } else {
    // Create a new block
    const newBlock = await prisma.block.create({
      data: {
        order: itemIndex === 0 ? 0 : itemIndex,
        article: {
          connect: {
            id: article.id,
          },
        },
      },
    });

    if (blockName === "banner" && contentData) {
      if (contentType === "promotion") {
        // Create a new BannerBlock with the promotion
        await prisma.bannerBlock.create({
          data: {
            type: contentType,
            promotion: {
              connect: {
                id: contentData[0].id,
              },
            },
            block: {
              connect: {
                id: newBlock.id,
              },
            },
          },
        });
      } else if (contentType === "campaign" && contentData) {
        // Create a new BannerBlock with the campaign
        await prisma.bannerBlock.create({
          data: {
            type: contentType,
            campaign: {
              connect: {
                id: contentData[0].id,
              },
            },
            block: {
              connect: {
                id: newBlock.id,
              },
            },
          },
        });
      } else {
        throw new Error(`Invalid data type: ${contentType}`);
      }
    } else if (blockName === "tile" && contentData) {
      if (contentType === "promotion") {
        // Create a new TileBlock with the promotion
        await prisma.tileBlock.create({
          data: {
            type: contentType,
            promotions: {
              connect: contentData.map((promotion) => ({ id: promotion.id })),
            },
            block: {
              connect: {
                id: newBlock.id,
              },
            },
          },
        });
      } else if (contentType === "campaign" && contentData) {
        // Create a new TileBlock with the campaign
        await prisma.tileBlock.create({
          data: {
            type: contentType,
            campaigns: {
              connect: contentData.map((campaign) => ({ id: campaign.id })),
            },
            block: {
              connect: {
                id: newBlock.id,
              },
            },
          },
        });
      } else {
        throw new Error(`Invalid data type: ${contentType}`);
      }
    } else if (blockName === "text" && stringData) {
      // Create a new TextBlock with the content
      const newTextBlock = await prisma.textBlock.create({
        data: {
          content: [stringData],
          block: {
            connect: {
              id: newBlock.id,
            },
          },
        },
      });

      // Update the block with the newly created TextBlock and itemOrder
      await prisma.block.update({
        where: {
          id: newBlock.id,
        },
        data: {
          order: itemIndex === 0 ? 0 : itemIndex,
          textBlock: {
            connect: {
              id: newTextBlock.id,
            },
          },
          bannerBlock: {
            disconnect: true,
          },
          tileBlock: {
            disconnect: true,
          },
        },
      });
    } else {
      throw new Error(`Invalid type: ${blockName}`);
    }
  }

  return article.id; // Return true to indicate successful update
};

export const deleteArticle = async (id: string) => {
  const brand = await prisma.article.findUnique({
    where: {
      id: parseInt(id),
    },
  });

  if (!brand) {
    return false;
  }

  return await prisma.article.delete({
    where: {
      id: parseInt(id),
    },
  });
};

export const searchArticles = async (searchArgs: BasicSearchArgs) => {
  const { title, category, page = 1, perPage = 10 } = searchArgs;

  const skip = (page - 1) * perPage;
  const take = perPage;

  // Construct a filter based on the search parameters provided
  const filter: { [key: string]: any } = {};

  if (title) {
    filter.title = {
      contains: title,
      mode: "insensitive",
    };
  }

  if (category) {
    filter.categories = {
      some: {
        name: {
          equals: category,
          mode: "insensitive",
        },
      },
    };
  }

  // Find and count the articles
  const [articles, totalArticles] = await Promise.all([
    prisma.article.findMany({
      where: filter,
      include: {
        articleCategories: {
          select: {
            id: true,
            name: true,
          },
        },
        thumbnail: true,
      },
      skip,
      take,
    }),
    prisma.article.count({
      where: filter,
    }),
  ]);

  const totalPages = Math.ceil(totalArticles / perPage);

  return { articles, totalPages };
};
