import type { ProductBlockContent, ProductCategory } from "@prisma/client";
import { prisma } from "~/db.server";
import { getOrderBy } from "~/helpers/sortHelpers";
import type { ArticleCategoryWithDetails } from "./articleCategories.server";
import type { DepartmentWithDetails } from "./departments.server";
import type { ProductSubCategoryWithDetails } from "./productSubCategories.server";
export type { ProductCategory } from "@prisma/client";

export interface ProductCategoryWithDetails extends ProductCategory {
  articleCategories?: ArticleCategoryWithDetails[] | null;
  department?: DepartmentWithDetails | null;
  productBlockContent?: ProductBlockContent[] | null;
  productSubCategories?: ProductSubCategoryWithDetails[] | null;
}

export type NewProductCategory = {
  name: string;
  index: number;
  department: string;
  displayInNavigation: boolean;
  isActive: boolean;
  productSubCategories?: string[];
  articleCategories?: string[];
  id?: string;
};

export const getProductCategories = async (): Promise<
  ProductCategoryWithDetails[]
> => {
  return prisma.productCategory.findMany({
    include: {
      productSubCategories: true,
      articleCategories: true,
      department: true,
    },
    orderBy: {
      index: "asc",
    },
  });
};

export const getProductCategory = async (
  id: string
): Promise<ProductCategoryWithDetails | null> => {
  return await prisma.productCategory.findUnique({
    where: {
      id: parseInt(id),
    },
    include: {
      articleCategories: true,
      productSubCategories: true,
      department: true,
    },
  });
};

export const upsertProductCategory = async (
  categoryData: NewProductCategory
): Promise<ProductCategory> => {
  const {
    id,
    index,
    name,
    displayInNavigation,
    isActive,
    department,
    articleCategories,
    productSubCategories,
  } = categoryData;

  const data: any = {
    name,
    index,
    displayInNavigation,
    isActive,
  };

  if (department) {
    data.department = {
      connect: { id: parseInt(department) },
    };
  }

  if (articleCategories && articleCategories.length > 0) {
    data.articleCategories = {
      connect: articleCategories
        .filter((categoryId: any) => !isNaN(parseInt(categoryId)))
        .map((categoryId: any) => ({
          id: parseInt(categoryId),
        })),
    };
  }

  if (productSubCategories && productSubCategories.length > 0) {
    data.productSubCategories = {
      connect: productSubCategories
        .filter((categoryId: any) => !isNaN(parseInt(categoryId)))
        .map((categoryId: any) => ({
          id: parseInt(categoryId),
        })),
    };
  }

  if (!id) {
    return await prisma.productCategory.create({
      data,
      include: {
        articleCategories: true,
        productSubCategories: true,
      },
    });
  } else {
    const existingProductCategory = await prisma.productCategory.findUnique({
      where: { id: parseInt(id) },
      include: {
        articleCategories: true,
        productSubCategories: true,
      },
    });

    if (!existingProductCategory) {
      throw new Error("Root category not found");
    }

    // Disconnect old article and product categories
    await prisma.productCategory.update({
      where: { id: parseInt(id) },
      data: {
        articleCategories: {
          disconnect: existingProductCategory.articleCategories.map(
            (category) => ({
              id: category.id,
            })
          ),
        },
        productSubCategories: {
          disconnect: existingProductCategory.productSubCategories.map(
            (category) => ({
              id: category.id,
            })
          ),
        },
      },
    });

    return await prisma.productCategory.update({
      where: { id: parseInt(id) },
      data,
      include: {
        articleCategories: true,
        productSubCategories: true,
      },
    });
  }
};

export const searchProductCategories = async (
  formData?: { [k: string]: FormDataEntryValue },
  url?: URL
): Promise<{ productCategories: ProductCategory[]; totalPages: number }> => {
  const name =
    formData?.name || (url && url.searchParams.get("name")?.toString()) || "";
  const department =
    formData?.department || url?.searchParams.get("department") || "";
  const productSubCategory =
    formData?.productSubCategory ||
    url?.searchParams.get("productSubCategory") ||
    "";
  const pageNumber =
    (formData?.pageNumber && parseInt(formData.pageNumber as string)) ||
    (url && Number(url.searchParams.get("pageNumber"))) ||
    1;
  const perPage =
    (formData?.perPage && parseInt(formData.perPage as string)) ||
    (url && Number(url.searchParams.get("perPage"))) ||
    10;
  const sortBy = formData?.sortBy || url?.searchParams.get("sortBy") || "";
  const sortOrder =
    formData?.sortOrder || url?.searchParams.get("sortOrder") || "";

  const skip = (pageNumber - 1) * perPage;
  const take = perPage;

  // Construct a where clause based on the search parameters provided
  const whereClause: { [key: string]: any } = {};

  if (name) {
    whereClause.name = {
      contains: name,
      mode: "insensitive",
    };
  }
  if (department) {
    whereClause.department = {
      id: parseInt(department as string),
    };
  }

  if (productSubCategory) {
    whereClause.productSubCategories = {
      some: {
        id: parseInt(productSubCategory as string),
      },
    };
  }

  // Find and count the root categories
  const [productCategories, totalProductCategories] = await Promise.all([
    prisma.productCategory.findMany({
      where: whereClause,
      include: {
        department: true,
        articleCategories: true,
        productSubCategories: true,
      },
      skip,
      take,
      orderBy: getOrderBy(sortBy as SortBy, sortOrder as SortOrder),
    }),
    prisma.productCategory.count({
      where: whereClause,
    }),
  ]);

  const totalPages = Math.ceil(totalProductCategories / perPage);

  return { productCategories, totalPages };
};
