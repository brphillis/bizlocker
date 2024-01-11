import { type FormEvent, useEffect, useState } from "react";
import { getFormData } from "~/helpers/formHelpers";
import DarkOverlay from "~/components/Layout/Overlays/DarkOverlay";
import BasicInput from "~/components/Forms/Input/BasicInput";
import type { ActionReturnTypes } from "~/utility/actionTypes";
import BasicSelect from "~/components/Forms/Select/BasicSelect";
import SelectGender from "~/components/Forms/Select/SelectGender";
import { validateForm, type ValidationErrors } from "~/utility/validate";
import BasicMultiSelect from "~/components/Forms/Select/BasicMultiSelect";
import BackSubmitButtons from "~/components/Forms/Buttons/BackSubmitButtons";
import UploadImageCollapse from "~/components/Forms/Upload/UploadImageCollapse";
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
import type { campaignUpsertLoader } from "./index.server";

const validateOptions = {
  name: true,
  department: true,
  productSubCategories: true,
  brands: true,
  minSaleRange: true,
  maxSaleRange: true,
  bannerImage: true,
  tileImage: true,
};

type Props = {
  offRouteModule?: boolean;
};

const CampaignUpsert = ({ offRouteModule }: Props) => {
  const { campaign, departments, productSubCategories, brands } =
    useLoaderData<typeof campaignUpsertLoader>() || {};
  const { serverValidationErrors, success, notification } =
    (useActionData() as ActionReturnTypes) || {};

  const navigate = useNavigate();
  let submit = useSubmit();
  const [searchParams] = useSearchParams();
  const contentId = searchParams.get("contentId");
  const { contentType } = useParams();
  useNotification(notification);

  const [clientValidationErrors, setClientValidationErrors] =
    useState<ValidationErrors>();
  const [loading, setLoading] = useState<boolean>(false);

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
        isActive={campaign?.isActive}
        title="Campaign"
        children={
          <Form
            method="POST"
            onSubmit={handleSubmit}
            className="scrollbar-hide relative w-[600px] max-w-full overflow-y-auto"
          >
            <div className="form-control">
              <div className="form-control gap-3">
                <div className="flex flex-wrap justify-evenly gap-3">
                  <BasicInput
                    label="Name"
                    type="text"
                    name="name"
                    placeholder="Name"
                    defaultValue={campaign?.name || ""}
                    validationErrors={
                      serverValidationErrors || clientValidationErrors
                    }
                  />

                  <BasicSelect
                    name="department"
                    label="Department"
                    selections={departments}
                    placeholder="Department"
                    defaultValue={campaign?.department?.id.toString()}
                    validationErrors={
                      serverValidationErrors || clientValidationErrors
                    }
                  />
                </div>

                <div className="divider w-full pt-4" />

                <div className="text-center">Campaign Filters</div>

                <div className="flex flex-wrap justify-evenly gap-3">
                  <BasicMultiSelect
                    name="productSubCategories"
                    label="Categories"
                    selections={productSubCategories}
                    defaultValues={campaign?.productSubCategories}
                    validationErrors={
                      serverValidationErrors || clientValidationErrors
                    }
                  />

                  <BasicMultiSelect
                    name="brands"
                    label="Targets Brands?"
                    selections={brands}
                    defaultValues={campaign?.brands}
                    validationErrors={
                      serverValidationErrors || clientValidationErrors
                    }
                  />
                </div>

                <div className="flex flex-wrap justify-evenly gap-3">
                  <BasicInput
                    label="Min Discount Range %"
                    type="number"
                    name="minSaleRange"
                    placeholder="Discount %"
                    defaultValue={campaign?.minSaleRange || ""}
                    validationErrors={
                      serverValidationErrors || clientValidationErrors
                    }
                  />

                  <BasicInput
                    label="Max Discount Range %"
                    type="number"
                    name="maxSaleRange"
                    placeholder="Discount %"
                    defaultValue={campaign?.maxSaleRange || ""}
                    validationErrors={
                      serverValidationErrors || clientValidationErrors
                    }
                  />
                </div>

                <div className="flex flex-wrap justify-evenly gap-3">
                  <SelectGender
                    defaultValue={campaign?.targetGender}
                    label="Has Target Gender?"
                  />

                  <div className="w-[95vw] sm:w-[215px]" />
                </div>
              </div>

              <div className="divider w-full pt-8" />

              <UploadImageCollapse
                name="bannerImage"
                label="Banner Image"
                tooltip="Optimal 8.09:1 Aspect Ratio"
                defaultValue={campaign?.bannerImage}
              />

              <div className="divider w-full pt-4" />

              <UploadImageCollapse
                name="tileImage"
                label="Tile Image"
                tooltip="Optimal Square Image"
                defaultValue={campaign?.tileImage}
              />
            </div>

            <BackSubmitButtons
              loading={loading}
              setLoading={setLoading}
              validationErrors={
                serverValidationErrors || clientValidationErrors
              }
            />
          </Form>
        }
      />
    </DarkOverlay>
  );
};

export default CampaignUpsert;
