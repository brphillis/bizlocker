import { redirect } from "@remix-run/server-runtime";
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
  let article = articleId
    ? await prisma.article.findUnique({
        where: {
          id: articleId,
        },
      })
    : await prisma.article.create({
        data: {
          title: "Untitled",
        },
      });

  const blocks = await prisma.block.findMany({
    where: {
      articleId: article?.id,
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

  const isValidItemIndex = itemIndex >= 0 && itemIndex <= blocks.length;
  if (!isValidItemIndex) {
    throw new Error(`Invalid itemIndex: ${itemIndex}`);
  }

  const blockToUpdate = blocks.find((e) => e.order === itemIndex);
  if (blockToUpdate) {
    if (blockName === "banner" && contentData) {
      const bannerBlock = blockToUpdate.bannerBlock;
      if (bannerBlock) {
        await prisma.bannerBlock.update({
          where: {
            id: bannerBlock.id,
          },
          data: {
            promotion: { disconnect: true },
            campaign: { disconnect: true },
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
          },
        });

        await prisma.block.update({
          where: { id: blockToUpdate.id },
          data: {
            order: itemIndex === 0 ? 0 : itemIndex,
            bannerBlock: { connect: { id: updatedBannerBlock.id } },
            tileBlock: { disconnect: true },
          },
        });
      }
    } else if (blockName === "tile" && contentData) {
      const tileBlock = blockToUpdate.tileBlock;
      if (tileBlock) {
        await prisma.tileBlock.update({
          where: { id: tileBlock.id },
          data: {
            promotions:
              contentType === "promotion"
                ? { connect: contentData.map((p) => ({ id: p.id })) }
                : undefined,
            campaigns:
              contentType === "campaign"
                ? { connect: contentData.map((c) => ({ id: c.id })) }
                : undefined,
          },
        });

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
          },
        });

        await prisma.block.update({
          where: { id: blockToUpdate.id },
          data: {
            order: itemIndex === 0 ? 0 : itemIndex,
            tileBlock: { connect: { id: updatedTileBlock.id } },
            bannerBlock: { disconnect: true },
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
          },
        });
      }
    } else {
      throw new Error(`Invalid type: ${blockName}`);
    }
  } else {
    const newBlock = await prisma.block.create({
      data: {
        order: itemIndex === 0 ? 0 : itemIndex,
        article: { connect: { id: article?.id } },
      },
    });

    if (blockName === "banner" && contentType && contentData) {
      const createData = {
        type: contentType,
        promotion:
          contentType === "promotion"
            ? { connect: { id: contentData[0].id } }
            : undefined,
        campaign:
          contentType === "campaign"
            ? { connect: { id: contentData[0].id } }
            : undefined,
        block: { connect: { id: newBlock.id } },
      };

      await prisma.bannerBlock.create({ data: createData });
    } else if (blockName === "tile" && contentType && contentData) {
      const createData = {
        type: contentType,
        promotions:
          contentType === "promotion"
            ? { connect: contentData.map((p) => ({ id: p.id })) }
            : undefined,
        campaigns:
          contentType === "campaign"
            ? { connect: contentData.map((c) => ({ id: c.id })) }
            : undefined,
        block: { connect: { id: newBlock.id } },
      };

      await prisma.tileBlock.create({ data: createData });
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
        },
      });
    } else {
      throw new Error(`Invalid type: ${blockName}`);
    }
  }

  return article?.id;
};

export const deleteArticle = async (id: number) => {
  const article = await prisma.article.findUnique({
    where: {
      id,
    },
    include: {
      blocks: {
        include: {
          bannerBlock: true,
          tileBlock: true,
          textBlock: true,
          blockOptions: true,
        },
      },
    },
  });

  if (!article) {
    return false;
  }

  // Delete blockOptions associated with each block
  for (const block of article.blocks) {
    if (block.blockOptions) {
      await prisma.blockOptions.delete({
        where: { id: block.blockOptions.id },
      });
    }
  }

  // Delete bannerBlocks, tileBlocks, and textBlocks associated with each block
  for (const block of article.blocks) {
    if (block.bannerBlock) {
      await prisma.bannerBlock.delete({ where: { id: block.bannerBlock.id } });
    }
    if (block.tileBlock) {
      await prisma.tileBlock.delete({ where: { id: block.tileBlock.id } });
    }
    if (block.textBlock) {
      await prisma.textBlock.delete({ where: { id: block.textBlock.id } });
    }
  }

  // Delete blocks associated with the article
  await prisma.block.deleteMany({ where: { articleId: id } });

  // Delete the article
  await prisma.article.delete({
    where: {
      id,
    },
  });

  return redirect("/admin/articles");
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
