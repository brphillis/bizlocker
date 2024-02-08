import { validateForm } from "~/utility/validate";
import type { PageNotification } from "~/hooks/PageNotification";
import { cleanBucketTask } from "~/models/Tasks/index.server";
import {
  copyDevBucketToProd,
  copyProdBucketToDev,
} from "~/integrations/aws/s3/s3.server";

const validateOptions = {};

export const taskUpsertLoader = async () => {
  return null;
};

export const tasksUpsertAction = async (request: Request) => {
  let notification: PageNotification;

  const { formEntries, formErrors } = validateForm(
    await request.formData(),
    validateOptions,
  );

  if (formErrors) {
    return { serverValidationErrors: formErrors };
  }

  switch (formEntries._action) {
    case "cleanS3": {
      await cleanBucketTask();

      notification = {
        type: "success",
        message: "Clean S3 Bucket Task Complete",
      };

      return { notification };
    }

    case "prodToDevS3": {
      await copyProdBucketToDev();

      notification = {
        type: "success",
        message: "Production Bucket Copied To Dev",
      };

      return { notification };
    }

    case "devToProdS3": {
      await copyDevBucketToProd();

      notification = {
        type: "success",
        message: "Dev Bucket Copied To Production",
      };

      return { notification };
    }
  }
};
