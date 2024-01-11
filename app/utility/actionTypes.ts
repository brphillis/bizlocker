import type { AusPostDeliveryOption } from "~/integrations/auspost/types";
import type { ValidationErrors } from "./validate";
import type { User } from "@prisma/client";
import type { Page, BlockWithContent } from "~/models/pageBuilder.server";
import type { PageNotification } from "~/hooks/PageNotification";

export interface ActionReturnTypes {
  validationErrors: ValidationErrors;
  serverValidationErrors: ValidationErrors;
  validationError: string;
  permissionError: string;
  notification: PageNotification;
  success: boolean;
  actionShippingOptions: AusPostDeliveryOption[];
  publishSuccess: boolean;
  updateSuccess: boolean;
  searchResults: any;
  metaValidationError: string[];
  actionPreview: Page;
  actionBlocks: BlockWithContent[];
  user: User;
}
