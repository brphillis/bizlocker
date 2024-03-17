import { json } from "@remix-run/node";
import { validateForm } from "~/utility/validate";
import type { PageNotification } from "~/hooks/PageNotification";
import { CartWithDetails } from "~/models/Cart/types";
import { deleteCart, getCart } from "~/models/Cart/index.server";

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
      const result = await deleteCart(id as string);

      if (result) {
        notification = {
          type: "warning",
          message: "Cart Deleted",
        };

        return { success: true, notification };
      } else {
        notification = {
          type: "error",
          message: "Error Deleting Cart",
        };

        return { success: false, notification };
      }
    }
  }
};
