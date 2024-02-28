import bcrypt from "bcryptjs";
import { prisma } from "../../db.server";
import { Staff } from "@prisma/client";
import {
  getUserDataFromSession,
  STAFF_SESSION_KEY,
} from "../../session.server";
import { convertToISO8601Date } from "../../../prisma/validation";
import { NewStaffDetails, StaffWithDetails } from "./types";

export const getStaff = async (
  id: string,
): Promise<StaffWithDetails | null> => {
  return await prisma.staff.findUnique({
    where: {
      id: parseInt(id),
    },
    include: {
      avatar: true,
      address: true,
      userDetails: true,
    },
  });
};

export const upsertStaff = async (
  request: Request,
  staffData: NewStaffDetails,
): Promise<{ createdStaff: Staff } | { updatedStaff: Staff }> => {
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
    role,
    jobTitle,
    password,
    store,
    isActive,
    id,
  } = staffData;

  let hashedPassword;

  if (password) {
    const { role } =
      ((await getUserDataFromSession(request, STAFF_SESSION_KEY)) as Staff) ||
      {};

    if (role !== "DEVELOPER" && role !== "ADMIN") {
      throw new Error("You Are Not Authorized to Change Passwords.");
    }

    const salt = await bcrypt.genSalt(10);
    hashedPassword = await bcrypt.hash(password, salt);
  }

  if (!id) {
    const createdStaff = await prisma.staff.create({
      data: {
        email,
        password: hashedPassword,
        role,
        jobTitle,
        doubleAuthentication: false,
        isActive,
        userDetails: {
          create: {
            firstName,
            lastName,
            phoneNumber,
            dateOfBirth: convertToISO8601Date(dateOfBirth),
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
        avatar: avatar
          ? {
              create: {
                href: avatar.href,
                altText: avatar.altText,
              },
            }
          : undefined,
        store: store
          ? {
              connect: {
                id: parseInt(store),
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

    return { createdStaff };
  } else {
    const updatedStaff = await prisma.staff.upsert({
      where: { id: parseInt(id) },
      update: {
        email,
        ...(password && { password: hashedPassword }),
        role,
        jobTitle,
        doubleAuthentication: false,
        isActive,
        userDetails: {
          upsert: {
            create: {
              firstName,
              lastName,
              phoneNumber,
              dateOfBirth: convertToISO8601Date(dateOfBirth),
            },
            update: {
              firstName,
              lastName,
              phoneNumber,
              dateOfBirth: convertToISO8601Date(dateOfBirth),
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
        store: store
          ? {
              connect: {
                id: parseInt(store),
              },
            }
          : {
              disconnect: true,
            },
      },
      create: {
        email,
        password: hashedPassword,
        role,
        jobTitle,
        userDetails: {
          create: {
            firstName,
            lastName,
            phoneNumber,
            dateOfBirth: convertToISO8601Date(dateOfBirth),
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
        store: store
          ? {
              connect: {
                id: parseInt(store),
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
    return { updatedStaff };
  }
};

export const searchStaff = async (
  searchArgs: BasicSearchArgs,
  includeAvatar?: boolean,
): Promise<{ staff: Staff[]; totalPages: number }> => {
  const { firstName, lastName, email, page, perPage } = searchArgs;

  const skip = (page - 1) * perPage;
  const take = perPage;

  // Construct a where clause based on the search parameters provided
  const whereClause: { [key: string]: unknown } = {};

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
