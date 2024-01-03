import type { BlockContent, Store } from "@prisma/client";
import { prisma } from "~/db.server";
import type { OrderItemWithDetails } from "./orders.server";
import type { StaffWithDetails } from "./auth/staff.server";
import type { TeamWithStaff } from "./teams.server";
import type { AddressWithDetails } from "./auth/userDetails";
import type {
  StockLevelWithDetails,
  StockTransferRequestWithDetails,
} from "./stock.server";

export interface StoreWithDetails extends Store {
  stock?: StockLevelWithDetails[] | null;
  orderItem?: OrderItemWithDetails[] | null;
  staff?: StaffWithDetails[] | null;
  blockContent?: BlockContent[] | null;
  team?: TeamWithStaff[] | null;
  address?: AddressWithDetails | null;
  fromStoreStockRequest?: StockTransferRequestWithDetails[] | null;
  toStoreStockRequest?: StockTransferRequestWithDetails[] | null;
}

export type NewStore = {
  name: string;
  dateOfBirth: string | Date;
  phoneNumber: string;
  faxNumber: string;
  addressLine1: string;
  addressLine2: string;
  postcode: string;
  suburb: string;
  state: string;
  country: string;
  longitude: string;
  latitude: string;
  paymentProviderId: string;
  isActive: boolean;
  id?: string;
};

export function getStores(): Promise<Store[]> {
  return prisma.store.findMany();
}

export const getStore = async (
  id: string
): Promise<StoreWithDetails | null> => {
  return prisma.store.findUnique({
    where: {
      id: parseInt(id),
    },
    include: {
      address: true,
    },
  });
};

export const upsertStore = async (
  storeData: NewStore
): Promise<{ createdStore: Store | null; updatedStore: Store | null }> => {
  const {
    name,
    phoneNumber,
    faxNumber,
    paymentProviderId,
    addressLine1,
    addressLine2,
    postcode,
    suburb,
    state,
    country,
    longitude,
    latitude,
    isActive,
    id,
  } = storeData;

  if (!id) {
    const createdStore = await prisma.store.create({
      data: {
        name,
        phoneNumber,
        faxNumber,
        paymentProviderId,
        isActive,
        address: {
          create: {
            addressLine1,
            addressLine2,
            postcode,
            suburb,
            state,
            country,
            longitude,
            latitude,
          },
        },
      },
      include: {
        address: true,
      },
    });

    return { createdStore, updatedStore: null };
  } else {
    const updatedStore = await prisma.store.upsert({
      where: { id: parseInt(id) },
      update: {
        name,
        phoneNumber,
        faxNumber,
        paymentProviderId,
        isActive,
        address: {
          upsert: {
            create: {
              addressLine1,
              addressLine2,
              postcode,
              suburb,
              state,
              country,
              longitude,
              latitude,
            },
            update: {
              addressLine1,
              addressLine2,
              postcode,
              suburb,
              state,
              country,
              longitude,
              latitude,
            },
          },
        },
      },
      create: {
        id: parseInt(id),
        name,
        phoneNumber,
        faxNumber,
        paymentProviderId,
        isActive,
        address: {
          create: {
            addressLine1,
            addressLine2,
            postcode,
            suburb,
            state,
            country,
            longitude,
            latitude,
          },
        },
      },
      include: {
        address: true,
      },
    });

    return { createdStore: null, updatedStore };
  }
};

export const deleteStore = async (id: string): Promise<Store> => {
  const store = await prisma.store.findUnique({
    where: {
      id: parseInt(id),
    },
    include: {
      address: true,
    },
  });

  if (!store) {
    throw new Error("Store Not Found");
  }

  if (store.address) {
    await prisma.address.delete({
      where: {
        id: store.address.id,
      },
    });
  }

  return await prisma.store.delete({
    where: {
      id: parseInt(id),
    },
  });
};

export const searchStores = async (
  formData?: { [k: string]: FormDataEntryValue },
  url?: URL
): Promise<{ stores: Store[]; totalPages: number }> => {
  const name =
    formData?.name || (url && url.searchParams.get("name")?.toString()) || "";
  const pageNumber =
    (formData?.pageNumber && parseInt(formData.pageNumber as string)) ||
    (url && Number(url.searchParams.get("pageNumber"))) ||
    1;
  const perPage =
    (formData?.perPage && parseInt(formData.perPage as string)) ||
    (url && Number(url.searchParams.get("perPage"))) ||
    10;
  let stores;
  let totalStores;

  const skip = (pageNumber - 1) * perPage;
  let take = perPage;
  if (perPage !== undefined) {
    if (name) {
      stores = await prisma.store.findMany({
        include: {
          address: true,
        },
        where: {
          OR: [
            {
              name: {
                contains: (name as string) || "",
                mode: "insensitive",
              },
            },
          ],
        },
        skip,
        take,
      });

      const totalCount = await prisma.store.count({
        where: {
          OR: [
            {
              name: {
                contains: (name as string) || "",
                mode: "insensitive",
              },
            },
          ],
        },
      });

      totalStores = totalCount;
    } else {
      stores = await prisma.store.findMany({
        include: {
          address: true,
        },
        skip,
        take,
      });

      totalStores = await prisma.store.count();
    }
    // Update `take` for the last page if needed
    if (skip + take > totalStores) {
      take = totalStores - skip;
    }
  } else {
    // Retrieve all stores without pagination
    stores = await prisma.store.findMany();
    totalStores = stores.length;
  }

  const totalPages = Math.ceil(totalStores / (Number(perPage) || 10));

  return { stores, totalPages };
};
