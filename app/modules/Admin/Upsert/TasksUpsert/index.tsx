import { type FormEvent, useState, useEffect } from "react";
import { validateForm } from "~/utility/validate";
import { getFormData } from "~/helpers/formHelpers";
import AdminPageHeader from "~/components/Layout/_Admin/AdminPageHeader";
import BackSubmitButtons from "~/components/Forms/Buttons/BackSubmitButtons";
import AdminPageWrapper from "~/components/Layout/Wrappers/AdminPageWrapper";
import { Outlet, useParams, useSubmit, useActionData } from "@remix-run/react";
import WindowContainer, {
  handleWindowedFormData,
} from "~/components/Layout/Containers/WindowContainer";
import useNotification from "~/hooks/PageNotification";
import type { ActionReturnTypes } from "~/utility/actionTypes";
import { ActionAlert } from "~/components/Notifications/Alerts";
import TaskListTask from "./TaskListTask";

const validateOptions = {};

const TasksUpsert = () => {
  const { notification } = (useActionData() as ActionReturnTypes) || {};

  const submit = useSubmit();
  const { contentType } = useParams();
  useNotification(notification);

  const [loading, setLoading] = useState<boolean>(false);
  const [taskRunning, setTaskRunning] = useState<string | undefined>();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    let form = getFormData(event);
    event.preventDefault();

    form = handleWindowedFormData(form);

    const { formErrors, formEntries } = validateForm(
      new FormData(form),
      validateOptions,
    );
    if (formErrors) {
      setLoading(false);
      return;
    }

    const { taskName } = formEntries || {};

    ActionAlert(
      "Warning",
      `Start Task - ${taskName}?`,
      () => {
        setTaskRunning(taskName as string);
        submit(form, {
          method: "POST",
          action: `/admin/upsert/${contentType}`,
        });
      },
      undefined,
      "warning",
    );
  };

  useEffect(() => {
    if (notification) {
      setTaskRunning(undefined);
    }
  }, [notification]);

  return (
    <AdminPageWrapper>
      <div className="relative h-max min-h-full w-full p-6">
        <AdminPageHeader title="Site Settings" />

        <div className="flex flex-col gap-3">
          <WindowContainer
            title="Media"
            extendStyle="bg-base-200"
            extendTitleBarStyle="!bg-base-500"
            hideClose={true}
          >
            <div className="flex flex-col items-start gap-3">
              <TaskListTask
                handleSubmit={handleSubmit}
                submitValue="cleanS3"
                taskName="Clean S3 Bucket"
                taskRunning={taskRunning}
              />
              <TaskListTask
                handleSubmit={handleSubmit}
                submitValue="prodToDevS3"
                taskName="Copy Production Bucket to Dev Bucket"
                taskRunning={taskRunning}
              />

              <TaskListTask
                handleSubmit={handleSubmit}
                submitValue="devToProdS3"
                taskName="Copy Dev Bucket to Production Bucket"
                taskRunning={taskRunning}
              />
            </div>
          </WindowContainer>
        </div>

        <BackSubmitButtons
          loading={loading}
          setLoading={setLoading}
          hideBack={true}
        />
      </div>
      <Outlet />
    </AdminPageWrapper>
  );
};

export default TasksUpsert;
