import { prisma } from "~/db.server";

export const getStaff = async (id: string) => {
  return await prisma.staff.findUnique({
    where: {
      id,
    },
    include: {
      avatar: true,
      address: true,
      userDetails: true,
    },
  });
};

export const upsertStaff = async (staffData: any) => {
  const {
    email,
    phoneNumber,
    dateOfBirth,
    firstName,
    lastName,
    addressLine1,
    addressLine2,
    postcode,
    suburb,
    state,
    country,
    avatar,
    isActive,
    id,
  } = staffData;

  if (!id) {
    return await prisma.staff.create({
      data: {
        email,
        userDetails: {
          create: {
            firstName,
            lastName,
            phoneNumber,
            dateOfBirth,
          },
        },
        address: {
          create: {
            addressLine1,
            addressLine2,
            postcode,
            suburb,
            state,
            country,
          },
        },
        doubleAuthentication: false,
        isActive,
        avatar: avatar
          ? {
              create: {
                href: avatar.href,
                altText: avatar.altText,
              },
            }
          : undefined,
      },
      include: {
        avatar: true,
        userDetails: true,
        address: true,
      },
    });
  } else {
    return await prisma.staff.upsert({
      where: { id },
      update: {
        email,
        userDetails: {
          upsert: {
            create: {
              firstName,
              lastName,
              phoneNumber,
              dateOfBirth,
            },
            update: {
              firstName,
              lastName,
              phoneNumber,
              dateOfBirth,
            },
          },
        },
        address: {
          upsert: {
            create: {
              addressLine1,
              addressLine2,
              postcode,
              suburb,
              state,
              country,
            },
            update: {
              addressLine1,
              addressLine2,
              postcode,
              suburb,
              state,
              country,
            },
          },
        },
        doubleAuthentication: false,
        isActive,
        avatar: avatar
          ? {
              upsert: {
                create: {
                  href: avatar.href,
                  altText: avatar.altText,
                },
                update: {
                  href: avatar.href,
                  altText: avatar.altText,
                },
              },
            }
          : undefined,
      },
      create: {
        id,
        email,
        userDetails: {
          create: {
            firstName,
            lastName,
            phoneNumber,
            dateOfBirth,
          },
        },
        address: {
          create: {
            addressLine1,
            addressLine2,
            postcode,
            suburb,
            state,
            country,
          },
        },
        doubleAuthentication: false,
        isActive,
        avatar: avatar
          ? {
              create: {
                href: avatar.href,
                altText: avatar.altText,
              },
            }
          : undefined,
      },
      include: {
        avatar: true,
        userDetails: true,
        address: true,
      },
    });
  }
};

export const searchStaff = async (
  searchArgs: BasicSearchArgs,
  includeAvatar?: boolean
) => {
  const { firstName, lastName, email, page, perPage } = searchArgs;

  const skip = (page - 1) * perPage;
  const take = perPage;

  // Construct a where clause based on the search parameters provided
  const whereClause: { [key: string]: any } = {};

  if (firstName) {
    whereClause.userDetails = {
      is: {
        firstName: {
          contains: firstName,
          mode: "insensitive",
        },
      },
    };
  }

  if (lastName) {
    whereClause.userDetails = {
      is: {
        lastName: {
          contains: lastName,
          mode: "insensitive",
        },
      },
    };
  }

  if (email) {
    whereClause.email = {
      contains: email,
      mode: "insensitive",
    };
  }

  // Find and count the users
  const [staff, totalStaff] = await Promise.all([
    prisma.staff.findMany({
      where: whereClause,
      skip,
      take,
      include: {
        userDetails: true,
        avatar: includeAvatar,
      },
    }),
    prisma.staff.count({
      where: whereClause,
    }),
  ]);

  const totalPages = Math.ceil(totalStaff / (Number(perPage) || 1));

  return { staff, totalPages };
};
