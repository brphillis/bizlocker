import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();
export const createInitialDeveloper = async () => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash("Erhjadc7!", salt);

  try {
    await prisma.user.create({
      data: {
        email: "brock@brockdev.com.au",
        password: hashedPassword,
        role: "DEVELOPER",
        userDetails: {
          create: {},
        },
        address: {
          create: {},
        },
      },
    });
    console.log("Initial developer user created");
  } catch (error: any) {
    if (error.code === "P2002") {
      console.log("Initial developer already created, skipping creation.");
    } else {
      console.error("Failed to create initial developer:", error);
    }
  } finally {
    await prisma.$disconnect();
  }
};

export const createSeedData = async () => {
  try {
    await createRandomBrands();
    await createRandomProductSubCategories();
    await createRandomProducts();
  } catch (error) {
    console.error("Error creating products and categories:", error);
  } finally {
    await prisma.$disconnect();
  }
};

const createRandomBrands = async () => {
  const existingDepartments = await prisma.department.findMany();
  if (existingDepartments.length > 0) {
    console.log("seed data already exist. Skipping seed creation.");
    return;
  }

  try {
    for (let i = 0; i < 5; i++) {
      await prisma.brand.create({
        data: {
          name: `Brand ${i + 1}`,
        },
      });
    }
    console.log("Random brands created successfully.");
  } catch (error) {
    console.error("Error creating random brands:", error);
  }
};

const createRandomProductSubCategories = async () => {
  try {
    const existingDepartments = await prisma.department.findMany();
    if (existingDepartments.length > 0) {
      console.log("seed data already exist. Skipping seed creation.");
      return;
    }

    const departmentNames = ["Department 1", "Department 2", "Department 3"];

    for (const departmentName of departmentNames) {
      const department = await prisma.department.create({
        data: {
          name: departmentName,
        },
      });

      const productCategoryNames = [
        "Root Category 1",
        "Root Category 2",
        "Root Category 3",
      ];

      for (const productCategoryName of productCategoryNames) {
        const productCategory = await prisma.productCategory.create({
          data: {
            name: productCategoryName,
            department: {
              connect: {
                id: department.id,
              },
            },
          },
        });

        const productSubCategoryNames = [
          "Product Category 1",
          "Product Category 2",
          "Product Category 3",
        ];

        for (const productSubCategoryName of productSubCategoryNames) {
          await prisma.productSubCategory.create({
            data: {
              name: productSubCategoryName,
              productCategory: {
                connect: {
                  id: productCategory.id,
                },
              },
            },
          });
        }
      }
    }

    console.log("Categories created successfully!");
  } catch (error) {
    console.error("Error creating categories:", error);
  } finally {
    await prisma.$disconnect();
  }
};

const createRandomProducts = async () => {
  try {
    const existingDepartments = await prisma.department.findMany();
    if (existingDepartments.length > 0) {
      console.log("seed data already exist. Skipping seed creation.");
      return;
    }

    for (let i = 0; i < 5; i++) {
      await prisma.product.create({
        data: {
          name: `Product ${i + 1}`,
          description: `Description for Product ${i + 1}`,
          variants: {
            create: [
              {
                name: "Variant A",
                sku: `SKU-A-${i + 1}`,
                price: 10.0,
                salePrice: null,
                isOnSale: false,
                stock: 100,
              },
              {
                name: "Variant B",
                sku: `SKU-B-${i + 1}`,
                price: 20.0,
                salePrice: 15.0,
                isOnSale: true,
                stock: 50,
              },
            ],
          },
        },
      });
    }
    console.log("Random products with variants created successfully.");
  } catch (error) {
    console.error("Error creating random products with variants:", error);
  }
};
