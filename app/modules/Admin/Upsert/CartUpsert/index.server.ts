import { json } from "@remix-run/node";
import { validateForm } from "~/utility/validate";
import type { PageNotification } from "~/hooks/PageNotification";
import { deleteBrand } from "~/models/Brands/index.server";
import { CartWithDetails } from "~/models/Cart/types";
import { getCart } from "~/models/Cart/index.server";

const validateOptions = {};

export const cartUpsertLoader = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("contentId");

  if (!id) {
    throw new Response(null, {
      status: 404,
      statusText: "Cart Not Found",
    });
  }

  const cart = id === "add" ? ({} as CartWithDetails) : await getCart(id);

  if (!cart) {
    throw new Response(null, {
      status: 404,
      statusText: "Cart Not Found",
    });
  }

  return json({ cart });
};

export const cartUpsertAction = async (request: Request) => {
  let notification: PageNotification;

  const { searchParams } = new URL(request.url);
  const contentId = searchParams.get("contentId");
  const id = contentId === "add" || !contentId ? undefined : contentId;

  const { formEntries } = validateForm(
    await request.formData(),
    validateOptions,
  );

  switch (formEntries._action) {
    case "delete": {
      await deleteBrand(id as string);

      notification = {
        type: "warning",
        message: "Brand Deleted",
      };

      return { success: true, notification };
    }
  }
};
