import type { Staff, StockLevel, StockTransferRequest } from "@prisma/client";
import { prisma } from "~/db.server";
import { STAFF_SESSION_KEY, getUserDataFromSession } from "~/session.server";
import type { ProductVariantWithDetails } from "./products.server";
import type { StoreWithDetails } from "./stores.server";
import type { PageNotification } from "~/hooks/PageNotification";

export interface StockLevelWithDetails extends StockLevel {
  productVariant?: ProductVariantWithDetails | null;
  store?: StoreWithDetails | null;
}

export interface StockTransferRequestWithDetails extends StockTransferRequest {
  fromStore?: StoreWithDetails | null;
  toStore?: StoreWithDetails | null;
  productVariant?: ProductVariantWithDetails | null;
}

export const getProductVariantStock = async (
  id: string
): Promise<StockLevelWithDetails[]> => {
  return prisma.stockLevel.findMany({
    where: {
      productVariantId: parseInt(id),
    },
    include: {
      store: true,
    },
  });
};

export const getStockTransfer = async (
  id: string
): Promise<StockTransferRequestWithDetails | null> => {
  return prisma.stockTransferRequest.findUnique({
    where: {
      id: parseInt(id),
    },
    include: {
      fromStore: true,
      toStore: true,
      productVariant: true,
    },
  });
};

export const searchStockTransfers = async (
  formData?: { [k: string]: FormDataEntryValue },
  url?: URL
): Promise<{ stockTransfers: StockTransferRequest[]; totalPages: number }> => {
  const sku =
    formData?.name || (url && url.searchParams.get("sku")?.toString()) || "";
  const status =
    formData?.name || (url && url.searchParams.get("status")?.toString()) || "";
  const fromStoreId =
    formData?.storeId ||
    (url && url.searchParams.get("fromStoreId")?.toString()) ||
    "";
  const toStoreId =
    formData?.storeId ||
    (url && url.searchParams.get("toStoreId")?.toString()) ||
    "";
  const pageNumber =
    (formData?.pageNumber && parseInt(formData.pageNumber as string)) ||
    (url && Number(url.searchParams.get("pageNumber"))) ||
    1;
  const perPage =
    (formData?.perPage && parseInt(formData.perPage as string)) ||
    (url && Number(url.searchParams.get("perPage"))) ||
    10;

  const skip = (pageNumber - 1) * perPage;
  let take = perPage;

  // Construct a where clause based on the search parameters provided
  const whereClause: { [key: string]: any } = {};

  if (sku) {
    whereClause.sku = {
      contains: sku,
      mode: "insensitive",
    };
  }
  if (status) {
    whereClause.status = {
      contains: status,
      mode: "insensitive",
    };
  }
  if (fromStoreId) {
    whereClause.fromStoreId = {
      equals: parseInt(fromStoreId as string),
    };
  }
  if (toStoreId) {
    whereClause.toStoreId = {
      equals: parseInt(toStoreId as string),
    };
  }

  // Find and count the users
  const [stockTransfers, totalStockTransfers] = await Promise.all([
    prisma.stockTransferRequest.findMany({
      where: whereClause,
      include: {
        toStore: {
          select: {
            name: true,
          },
        },
        fromStore: {
          select: {
            name: true,
          },
        },
        productVariant: {
          select: {
            id: true,
            name: true,
            sku: true,
          },
        },
      },
      skip,
      take,
    }),
    prisma.team.count({
      where: whereClause,
    }),
  ]);

  const totalPages = Math.ceil(totalStockTransfers / (Number(perPage) || 1));

  return { stockTransfers, totalPages };
};

export const approveStockTransfer = async (
  request: Request,
  stockTransferRequestId: string,
  toStoreId: string
): Promise<{
  transferRequest: StockTransferRequest | null;
  notification: PageNotification | null;
  permissionError: string | null;
}> => {
  const { storeId, role } =
    ((await getUserDataFromSession(request, STAFF_SESSION_KEY)) as Staff) || {};

  if (!storeId || storeId.toString() !== toStoreId) {
    const permissionError = "You must be a manager at the receiving store.";
    return { permissionError, transferRequest: null, notification: null };
  }

  if (
    role.toLowerCase() !== "manager" &&
    role.toLowerCase() !== "developer" &&
    role.toLowerCase() !== "admin"
  ) {
    const permissionError = "Permission Denied.";
    return { permissionError, transferRequest: null, notification: null };
  }

  const transferRequest = await prisma.stockTransferRequest.update({
    where: {
      id: parseInt(stockTransferRequestId),
    },
    data: {
      status: "approved",
    },
  });

  return {
    permissionError: null,
    transferRequest,
    notification: {
      type: "success",
      message: "Stock Transfer Updated.",
    },
  };
};

export const updateStockTransfer = async (
  request: Request,
  stockTransferRequestId: string,
  toStoreId: string,
  status: ApprovalStatus,
  quantity: string
): Promise<{
  transferRequest: StockTransferRequest | null;
  notification: PageNotification | null;
  permissionError: string | null;
}> => {
  const { storeId, role } =
    ((await getUserDataFromSession(request, STAFF_SESSION_KEY)) as Staff) || {};

  if (!storeId || storeId.toString() !== toStoreId) {
    const permissionError = "You must be a manager at the receiving store.";
    return { permissionError, notification: null, transferRequest: null };
  }

  if (
    role.toLowerCase() !== "manager" &&
    role.toLowerCase() !== "developer" &&
    role.toLowerCase() !== "admin"
  ) {
    const permissionError = "Permission Denied.";
    return { permissionError, notification: null, transferRequest: null };
  }

  const transferRequest = await prisma.stockTransferRequest.update({
    where: {
      id: parseInt(stockTransferRequestId),
    },
    data: {
      status: status,
    },
  });

  if (status === "complete") {
    const fromStoreStock = await prisma.stockLevel.findFirst({
      where: {
        AND: [
          { productVariantId: transferRequest.productVariantId },
          { storeId: transferRequest.fromStoreId },
        ],
      },
    });

    if (fromStoreStock) {
      await prisma.stockLevel.update({
        where: {
          id: fromStoreStock.id,
        },
        data: {
          quantity: {
            decrement: parseInt(quantity),
          },
        },
      });
    } else {
      return {
        permissionError: null,
        transferRequest: null,
        notification: {
          type: "error",
          message: "No Stock At Sending Store.",
        },
      };
    }

    const toStoreStock = await prisma.stockLevel.findFirst({
      where: {
        AND: [
          { productVariantId: transferRequest.productVariantId },
          { storeId: transferRequest.toStoreId },
        ],
      },
    });

    if (toStoreStock) {
      await prisma.stockLevel.update({
        where: {
          id: toStoreStock.id,
        },
        data: {
          quantity: {
            increment: parseInt(quantity),
          },
        },
      });
    } else {
      await prisma.stockLevel.create({
        data: {
          quantity: parseInt(quantity),
          productVariant: {
            connect: { id: transferRequest.productVariantId },
          },
          store: {
            connect: { id: transferRequest.toStoreId },
          },
        },
      });
    }
  }

  if (status === "cancelled") {
    return {
      permissionError: null,
      transferRequest,
      notification: {
        type: "warning",
        message: "Stock Transfer Cancelled.",
      },
    };
  } else {
    return {
      permissionError: null,
      transferRequest,
      notification: {
        type: "success",
        message: "Stock Transfer Updated.",
      },
    };
  }
};
