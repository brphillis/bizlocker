import { prisma } from "~/db.server";
import bcrypt from "bcryptjs";

export const createSeedData = async () => {
  console.log("Running Build Seed Functions");
  try {
    await createInitialDeveloper();
    await createSiteSettings();
    await createHomePage();
    await createEcommerceSeedData();
  } catch (error) {
    console.error("Error creating products and categories:", error);
  } finally {
    await prisma.$disconnect();
  }
};

const createInitialDeveloper = async () => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash("Erhjadc7!", salt);

  try {
    const existingDev = await prisma.staff.findFirst({
      where: {
        email: "brock@brockdev.com.au",
      },
    });

    if (!existingDev) {
      await prisma.staff.create({
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

      console.log("Initial admin created");
    }
  } catch (error: unknown) {
    if ((error as CatchError).code === "P2002") {
      console.log("Initial developer already created, skipping creation.");
    } else {
      console.error("Failed to create initial developer:", error);
    }
  } finally {
    await prisma.$disconnect();
  }
};

const createHomePage = async () => {
  const existingHomePage = await prisma.homePage.findFirst();

  if (existingHomePage) {
    const connectedPreviewPage = await prisma.previewPage.findFirst({
      where: {
        homePageId: existingHomePage.id,
      },
    });

    if (connectedPreviewPage) {
      console.log(
        "Home page already exists and is connected to a preview page. Skipping seed creation.",
      );
    } else {
      // Create a new preview page and connect it to the existing homepage
      await prisma.previewPage.create({
        data: {
          homePage: {
            connect: { id: existingHomePage.id }, // Connect the existing homepage to the new preview page
          },
          // You can specify any additional properties you want to set for the preview page here
        },
      });

      console.log("Connected an existing homepage to a new preview page.");
    }
  } else {
    // Create a new homepage
    const newHomePage = await prisma.homePage.create({
      data: {
        // You can specify any additional properties you want to set for the homepage here
      },
    });

    // Create a new preview page and connect it to the newly created homepage
    await prisma.previewPage.create({
      data: {
        homePage: {
          connect: { id: newHomePage.id }, // Connect the new homepage to the new preview page
        },
        // You can specify any additional properties you want to set for the preview page here
      },
    });

    console.log(
      "Created a new homepage and connected it to a new preview page.",
    );
  }
};

const createSiteSettings = async () => {
  const existingSiteSettings = await prisma.siteSettings.findFirst();

  if (!existingSiteSettings) {
    await prisma.siteSettings.create({});
  } else {
    console.log("Initial SiteSettings already created, skipping creation.");
  }
};

const createEcommerceSeedData = async () => {
  try {
    const existingBrands = await prisma.brand.findMany();

    if (!existingBrands) {
      await prisma.brand.create({
        data: {
          name: "None",
        },
      });
    }

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
