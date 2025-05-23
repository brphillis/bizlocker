import { getAusPostServices } from "~/integrations/auspost/auspost.server";
import type {
  AusPostDeliveryOption,
  GetPostageServicesType,
} from "~/integrations/auspost/types";

export const getShippingServices_Integration = async ({
  from_postcode,
  to_postcode,
  length,
  width,
  height,
  weight,
}: GetPostageServicesType): Promise<AusPostDeliveryOption[]> => {
  return await getAusPostServices({
    from_postcode,
    to_postcode,
    length,
    width,
    height,
    weight,
  });
};
