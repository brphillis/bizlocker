import type { Department } from "@prisma/client";
import type { CampaignWithContent } from "./campaigns.server";
import type { ProductCategoryWithDetails } from "./productCategories.server";
import type { PromotionWithContent } from "./promotions.server";
import { prisma } from "~/db.server";
import { getOrderBy } from "~/helpers/sortHelpers";

export interface DepartmentWithDetails extends Department {
  campaigns?: CampaignWithContent[] | null;
  productCategories?: ProductCategoryWithDetails[] | null;
  promotions?: PromotionWithContent[] | null;
}

export const getDepartment = async (
  id: string
): Promise<DepartmentWithDetails | null> => {
  return prisma.department.findUnique({
    where: {
      id: parseInt(id),
    },
    include: {
      productCategories: true,
    },
  });
};

export const getDepartments = async (): Promise<DepartmentWithDetails[]> => {
  return await prisma.department.findMany({
    orderBy: {
      index: "asc",
    },
  });
};

export const upsertDepartment = async (
  departmentData: any
): Promise<Department> => {
  const { id, name, index, isActive, displayInNavigation, productCategories } =
    departmentData;

  const data: any = {
    name,
    index,
    isActive,
    displayInNavigation,
  };

  if (!id) {
    return await prisma.department.create({
      data,
      include: {
        productCategories: true,
      },
    });
  } else {
    const existingDepartment = await prisma.department.findUnique({
      where: { id: parseInt(id) },
      include: {
        productCategories: true,
      },
    });

    if (!existingDepartment) {
      throw new Error("Department not found");
    }

    // Disconnect old categories
    await prisma.department.update({
      where: { id: parseInt(id) },
      data: {
        productCategories: {
          disconnect: existingDepartment.productCategories.map((category) => ({
            id: category.id,
          })),
        },
      },
    });

    data.productCategories = {
      connect: productCategories.map((category: any) => ({
        id: category.id,
      })),
    };

    return await prisma.department.update({
      where: { id: parseInt(id) },
      data,
    });
  }
};

export const searchDepartments = async (
  searchArgs: BasicSearchArgs
): Promise<{ departments: Department[]; totalPages: number }> => {
  const { name, sortBy, sortOrder, page, perPage } = searchArgs;

  let departments;
  let totalDepartments;

  const skip = (page - 1) * perPage;
  let take = perPage;

  if (perPage !== undefined) {
    if (name) {
      departments = await prisma.department.findMany({
        where: {
          OR: [
            {
              name: {
                contains: name || "",
                mode: "insensitive",
              },
            },
          ],
        },
        skip,
        take,
      });

      const totalCount = await prisma.department.count({
        where: {
          OR: [
            {
              name: {
                contains: name || "",
                mode: "insensitive",
              },
            },
          ],
        },
      });

      totalDepartments = totalCount;
    } else {
      departments = await prisma.department.findMany({
        skip,
        take,
        orderBy: getOrderBy(sortBy as SortBy, sortOrder as SortOrder),
      });

      totalDepartments = await prisma.department.count();
    }
    // Update `take` for the last page if needed
    if (skip + take > totalDepartments) {
      take = totalDepartments - skip;
    }
  } else {
    // Retrieve all departments without pagination
    departments = await prisma.department.findMany();
    totalDepartments = departments.length;
  }

  const totalPages = Math.ceil(totalDepartments / (Number(perPage) || 10));

  return { departments, totalPages };
};
