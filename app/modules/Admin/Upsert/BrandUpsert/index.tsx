import { type FormEvent, useEffect, useState } from "react";
import { getFormData } from "~/helpers/formHelpers";
import DarkOverlay from "~/components/Layout/Overlays/DarkOverlay";
import BasicInput from "~/components/Forms/Input/BasicInput";
import type { ActionReturnTypes } from "~/utility/actionTypes";
import { type ValidationErrors, validateForm } from "~/utility/validate";
import BackSubmitButtons from "~/components/Forms/Buttons/BackSubmitButtons";
import useNotification from "~/hooks/PageNotification";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigate,
  useSubmit,
  useSearchParams,
  useParams,
} from "@remix-run/react";
import WindowContainer, {
  handleWindowedFormData,
} from "~/components/Layout/Containers/WindowContainer";
import type { brandUpsertLoader } from "./index.server";
import TabContent from "~/components/Tabs/TabContent";
import UploadImageCollapse from "~/components/Forms/Upload/UploadImageCollapse";

const validateOptions = {
  name: true,
};

type Props = {
  offRouteModule?: boolean;
};

const BrandUpsert = ({ offRouteModule }: Props) => {
  const { brand } = useLoaderData<typeof brandUpsertLoader>();
  const { serverValidationErrors, success, notification } =
    (useActionData() as ActionReturnTypes) || {};

  const navigate = useNavigate();
  const submit = useSubmit();
  const [searchParams] = useSearchParams();
  const contentId = searchParams.get("contentId");
  const { contentType } = useParams();
  useNotification(notification);

  const [clientValidationErrors, setClientValidationErrors] =
    useState<ValidationErrors>();
  const [loading, setLoading] = useState<boolean>(false);

  const tabNames = ["general", "images"];
  const [activeTab, setActiveTab] = useState<string | undefined>(tabNames?.[0]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    let form = getFormData(event);
    event.preventDefault();

    form = handleWindowedFormData(form);

    const { formErrors } = validateForm(new FormData(form), validateOptions);
    if (formErrors) {
      setClientValidationErrors(formErrors);
      setLoading(false);
      return;
    }

    submit(form, {
      method: "POST",
      action: `/admin/upsert/${contentType}?contentId=${contentId}`,
      navigate: offRouteModule ? false : true,
    });

    if (offRouteModule) {
      navigate(-1);
    }
  };

  useEffect(() => {
    if (success) {
      navigate(-1);
    }
  }, [success, navigate]);

  return (
    <DarkOverlay>
      <WindowContainer
        hasIsActive={true}
        hasMode={true}
        isActive={brand?.isActive}
        title="Brand"
        setActiveTab={handleTabChange}
        tabNames={tabNames}
        activeTab={activeTab}
      >
        <Form
          method="POST"
          onSubmit={handleSubmit}
          className="scrollbar-hide relative w-[500px] max-w-full overflow-y-auto"
        >
          <TabContent tab="general" activeTab={activeTab} extendStyle="gap-3">
            <BasicInput
              name="name"
              label="Name"
              placeholder="Name"
              type="text"
              extendContainerStyle="w-full"
              defaultValue={brand?.name || undefined}
              validationErrors={
                serverValidationErrors || clientValidationErrors
              }
            />
          </TabContent>

          <TabContent tab="images" activeTab={activeTab} extendStyle="gap-3">
            <UploadImageCollapse
              name="heroImage"
              label="Hero Image"
              tooltip="Optimal Transparent Background"
              defaultValue={brand?.heroImage}
            />
          </TabContent>

          <BackSubmitButtons
            loading={loading}
            setLoading={setLoading}
            validationErrors={serverValidationErrors || clientValidationErrors}
          />
        </Form>
      </WindowContainer>
    </DarkOverlay>
  );
};

export default BrandUpsert;
