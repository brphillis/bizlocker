import { AusPostDeliveryOption } from "~/integrations/auspost/types";
import { ValidationErrors } from "./validate";
import { User } from "@prisma/client";
import { PageNotification } from "~/hooks/PageNotification";
import { Page } from "~/models/PageBuilder/types";
import { BlockWithContent } from "~/models/Blocks/types";

export interface ActionReturnTypes {
  validationErrors: ValidationErrors;
  serverValidationErrors: ValidationErrors;
  validationError: string;
  permissionError: string;
  notification: PageNotification;
  success: boolean;
  actionShippingOptions: AusPostDeliveryOption[];
  publishSuccess: boolean;
  revertSuccess: boolean;
  updateSuccess: boolean;
  searchResults: unknown;
  metaValidationError: string[];
  actionPreview: Page;
  actionBlocks: BlockWithContent[];
  user: User;
}
