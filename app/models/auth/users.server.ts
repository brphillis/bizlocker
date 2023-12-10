import type { User, Image } from "@prisma/client";
import { prisma } from "~/db.server";
import type { AddressWithDetails, UserDetailsDetailed } from "./userDetails";
import type { CartItemWithDetails } from "../cart.server";
import type { OrderWithDetails } from "../orders.server";

export interface UserWithDetails extends User {
  avatar?: Image | null;
  address?: AddressWithDetails | null;
  cart?: CartItemWithDetails | null;
  orders?: OrderWithDetails[] | null;
  userDetails?: UserDetailsDetailed | null;
}

export const getUser = async (id: string): Promise<UserWithDetails | null> => {
  return await prisma.user.findUnique({
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

export const upsertUser = async (userData: any): Promise<User> => {
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
  } = userData;

  if (!id) {
    return await prisma.user.create({
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
    return await prisma.user.upsert({
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

export const searchUsers = async (
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
  const [users, totalUsers] = await Promise.all([
    prisma.user.findMany({
      where: whereClause,
      skip,
      take,
      include: {
        userDetails: true,
        avatar: includeAvatar,
      },
    }),
    prisma.user.count({
      where: whereClause,
    }),
  ]);

  const totalPages = Math.ceil(totalUsers / (Number(perPage) || 1));

  return { users, totalPages };
};
