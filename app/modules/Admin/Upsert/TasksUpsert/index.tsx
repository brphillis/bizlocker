import { type FormEvent, useState } from "react";
import { validateForm } from "~/utility/validate";
import { getFormData } from "~/helpers/formHelpers";
import AdminPageHeader from "~/components/Layout/_Admin/AdminPageHeader";
import BackSubmitButtons from "~/components/Forms/Buttons/BackSubmitButtons";
import AdminPageWrapper from "~/components/Layout/Wrappers/AdminPageWrapper";
import {
  Form,
  Outlet,
  useParams,
  useSubmit,
  useActionData,
} from "@remix-run/react";
import WindowContainer, {
  handleWindowedFormData,
} from "~/components/Layout/Containers/WindowContainer";
import useNotification from "~/hooks/PageNotification";
import type { ActionReturnTypes } from "~/utility/actionTypes";
import SquareIconButton from "~/components/Buttons/SquareIconButton";

const validateOptions = {};

const TasksUpsert = () => {
  const { notification } = (useActionData() as ActionReturnTypes) || {};

  const submit = useSubmit();
  const { contentType } = useParams();
  useNotification(notification);

  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    let form = getFormData(event);
    event.preventDefault();

    form = handleWindowedFormData(form);

    const { formErrors } = validateForm(new FormData(form), validateOptions);
    if (formErrors) {
      setLoading(false);
      return;
    }

    submit(form, {
      method: "POST",
      action: `/admin/upsert/${contentType}`,
    });
  };

  return (
    <AdminPageWrapper>
      <Form
        method="POST"
        onSubmit={handleSubmit}
        className="relative h-max min-h-full w-full p-6"
      >
        <AdminPageHeader title="Site Settings" />

        <div className="flex flex-col gap-3">
          <WindowContainer
            title="Media"
            extendStyle="bg-base-200"
            extendTitleBarStyle="!bg-base-500"
            hideClose={true}
          >
            <div className="flex flex-col items-start gap-3">
              <div className="relative flex items-center gap-3">
                <div className="text-sm">Clean S3 Bucket</div>
                <SquareIconButton
                  iconName="IoPlay"
                  size="xsmall"
                  type="submit"
                  name="_action"
                  value="cleanS3"
                  color="primary"
                />
              </div>
            </div>
          </WindowContainer>
        </div>

        <BackSubmitButtons
          loading={loading}
          setLoading={setLoading}
          hideBack={true}
        />
      </Form>
      <Outlet />
    </AdminPageWrapper>
  );
};

export default TasksUpsert;
