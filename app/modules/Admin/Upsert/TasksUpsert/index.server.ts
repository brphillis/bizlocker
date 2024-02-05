import { validateForm } from "~/utility/validate";
import type { PageNotification } from "~/hooks/PageNotification";
import { cleanBucketTask } from "~/models/Tasks/index.server";

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
  }
};
