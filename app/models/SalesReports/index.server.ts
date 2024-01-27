import { prisma } from "~/db.server";
import {
  createNowISODate,
  createYesterdayISODate,
} from "~/helpers/dateHelpers";

export const getSalesToday = async (): Promise<{
  totalSalesToday?: number | null;
  totalSalesYesterday?: number | null;
  productCountToday?: number | null;
  topProductSubCategoriesToday?: {
    productSubCategory?: string | null;
    totalSales?: number | null;
  }[];
  topBrandsToday?: {
    brand?: string | null;
    totalSales?: number | null;
  }[];
}> => {
  const today = createNowISODate();
  const yesterday = createYesterdayISODate();

  const totalSalesToday = await prisma.order.aggregate({
    _sum: {
      totalPrice: true,
    },
    where: {
      createdAt: {
        gte: today,
      },
      status: {
        notIn: ["cancelled", "created"],
      },
    },
  });

  const totalSalesYesterday = await prisma.order.aggregate({
    _sum: {
      totalPrice: true,
    },
    where: {
      createdAt: {
        gte: yesterday,
        lt: today,
      },
      status: {
        notIn: ["cancelled", "created"],
      },
    },
  });

  const productCountToday = await prisma.orderItem.aggregate({
    _sum: {
      quantity: true,
    },
    where: {
      order: {
        createdAt: {
          gte: today,
        },
        status: {
          notIn: ["cancelled", "created"],
        },
      },
    },
  });

  const salesByProductSubCategoryToday =
    await prisma.productSubCategory.findMany({
      include: {
        products: {
          include: {
            variants: {
              include: {
                orderItems: {
                  where: {
                    order: {
                      createdAt: {
                        gte: today,
                      },
                      status: {
                        notIn: ["cancelled", "created"],
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

  const salesByBrandToday = await prisma.brand.findMany({
    include: {
      products: {
        include: {
          variants: {
            include: {
              orderItems: {
                where: {
                  order: {
                    createdAt: {
                      gte: today,
                    },
                    status: {
                      notIn: ["cancelled", "created"],
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  const topProductSubCategoriesToday = salesByProductSubCategoryToday
    .map((category) => ({
      productSubCategory: category.name,
      totalSales: category.products.reduce(
        (total, product) =>
          total +
          product.variants.reduce(
            (sales, variant) =>
              sales +
              variant.orderItems.reduce(
                (quantity, orderItem) => quantity + orderItem.quantity,
                0,
              ),
            0,
          ),
        0,
      ),
    }))
    .sort((a, b) => b.totalSales - a.totalSales)
    .slice(0, 10);

  const topBrandsToday = salesByBrandToday
    .map((brand) => ({
      brand: brand.name,
      totalSales: brand.products.reduce(
        (total, product) =>
          total +
          product.variants.reduce(
            (sales, variant) =>
              sales +
              variant.orderItems.reduce(
                (quantity, orderItem) => quantity + orderItem.quantity,
                0,
              ),
            0,
          ),
        0,
      ),
    }))
    .sort((a, b) => b.totalSales - a.totalSales)
    .slice(0, 10);

  return {
    totalSalesToday: totalSalesToday._sum.totalPrice,
    totalSalesYesterday: totalSalesYesterday._sum.totalPrice,
    productCountToday: productCountToday._sum.quantity,
    topProductSubCategoriesToday,
    topBrandsToday,
  };
};
