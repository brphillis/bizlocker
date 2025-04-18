import { type FormEvent, useEffect, useState } from "react";
import { Product } from "@prisma/client";
import { getFormData } from "~/helpers/formHelpers";
import TabContent from "~/components/Tabs/TabContent";
import useNotification from "~/hooks/PageNotification";
import BasicTextArea from "~/components/Forms/TextArea";
import { ActionReturnTypes } from "~/utility/actionTypes";
import BasicInput from "~/components/Forms/Input/BasicInput";
import { ProductWithDetails } from "~/models/Products/types";
import BasicSelect from "~/components/Forms/Select/BasicSelect";
import SelectGender from "~/components/Forms/Select/SelectGender";
import DarkOverlay from "~/components/Layout/Overlays/DarkOverlay";
import { type ValidationErrors, validateForm } from "~/utility/validate";
import BackSubmitButtons from "~/components/Forms/Buttons/BackSubmitButtons";
import UploadImageCollapse from "~/components/Forms/Upload/UploadImageCollapse";
import TabValidationErrors from "~/components/Forms/Validation/TabValidationErrors";
import WindowContainer, {
  handleWindowedFormData,
} from "~/components/Layout/Containers/WindowContainer";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigate,
  useParams,
  useSearchParams,
  useSubmit,
} from "@remix-run/react";

import { promotionUpsertLoader } from "./index.server";

const validateOptions = {
  name: true,
  department: true,
  discountPercentage: true,
  bannerImage: true,
  tileImage: true,
};

type Props = {
  offRouteModule?: boolean;
};

const PromotionUpsert = ({ offRouteModule }: Props) => {
  const { promotion, departments } =
    useLoaderData<typeof promotionUpsertLoader>() || {};
  const { serverValidationErrors, success, notification } =
    (useActionData() as ActionReturnTypes) || {};

  const { products } = (promotion as { products: ProductWithDetails[] }) || {};

  const navigate = useNavigate();
  const submit = useSubmit();
  const [searchParams] = useSearchParams();
  const contentId = searchParams.get("contentId");
  const { contentType } = useParams();
  useNotification(notification);

  const [clientValidationErrors, setClientValidationErrors] =
    useState<ValidationErrors>();
  const [loading, setLoading] = useState<boolean>(false);

  const tabNames = ["general", "images", "meta", "products"];
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
        activeTab={activeTab}
        hasIsActive={true}
        hasMode={true}
        isActive={promotion?.isActive}
        setActiveTab={handleTabChange}
        tabNames={tabNames}
        title="Promotion"
      >
        <Form
          method="POST"
          onSubmit={handleSubmit}
          className="scrollbar-hide relative w-[600px] max-w-full overflow-y-auto"
        >
          <TabContent tab="general" activeTab={activeTab} extendStyle="gap-3">
            <>
              <BasicInput
                label="Name"
                name="name"
                type="text"
                placeholder="Name"
                extendContainerStyle="w-full"
                defaultValue={promotion?.name || undefined}
                validationErrors={
                  serverValidationErrors || clientValidationErrors
                }
              />

              <BasicSelect
                name="department"
                label="Department"
                selections={departments}
                placeholder="Department"
                extendContainerStyle="w-full"
                defaultValue={promotion?.department?.id.toString()}
                validationErrors={
                  serverValidationErrors || clientValidationErrors
                }
              />

              <BasicInput
                name="discountPercentage"
                label="Discount %"
                placeholder="Discount %"
                type="number"
                extendContainerStyle="w-full"
                defaultValue={promotion?.discountPercentage || ""}
                validationErrors={
                  serverValidationErrors || clientValidationErrors
                }
              />

              <SelectGender
                defaultValue={promotion?.targetGender}
                label="Has Target Gender?"
                extendContainerStyle="w-full"
              />
            </>
          </TabContent>

          <TabContent tab="images" activeTab={activeTab}>
            <>
              <TabValidationErrors
                formName="bannerImage"
                clientValidationErrors={clientValidationErrors}
                serverValidationErrors={serverValidationErrors}
              />

              <UploadImageCollapse
                name="bannerImage"
                label="Banner Image"
                tooltip="Optimal 8.09:1 Aspect Ratio"
                defaultValue={promotion?.bannerImage}
              />

              <div className="divider w-full pt-4" />

              <TabValidationErrors
                formName="tileImage"
                clientValidationErrors={clientValidationErrors}
                serverValidationErrors={serverValidationErrors}
              />

              <UploadImageCollapse
                name="tileImage"
                label="Tile Image"
                tooltip="Optimal Square Image"
                defaultValue={promotion?.tileImage}
              />
            </>
          </TabContent>

          <TabContent tab="meta" activeTab={activeTab}>
            <BasicTextArea
              name="metaDescription"
              label="Meta Description"
              placeholder="Meta Description"
              extendContainerStyle="w-full"
              defaultValue={promotion?.metaDescription || ""}
              validationErrors={
                serverValidationErrors || clientValidationErrors
              }
            />
          </TabContent>

          <TabContent tab="products" activeTab={activeTab}>
            <div className="max-w-full overflow-x-auto sm:max-w-none">
              <table className="table table-md">
                <thead>
                  <tr>
                    <th></th>
                    <th>Name</th>
                    <th>Gender</th>
                    <th>Active</th>
                  </tr>
                </thead>
                <tbody>
                  {products?.map((product: Product, i) => {
                    const { id, name, gender, isActive } = product || {};

                    return (
                      <tr
                        key={"product_" + (name || i)}
                        className="hover cursor-pointer"
                        onClick={() => navigate(`/admin/products/${id}`)}
                      >
                        <th>{i + 1}</th>
                        <td>{name}</td>
                        <td>{gender}</td>

                        <td>
                          {!isActive && (
                            <div className="ml-4 h-3 w-3 rounded-full bg-red-500" />
                          )}
                          {isActive && (
                            <div className="ml-4 h-3 w-3 self-center rounded-full bg-success" />
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {products && (
                <input
                  type="hidden"
                  name="products"
                  value={JSON.stringify(products.map((e) => e.id)) || ""}
                />
              )}
            </div>
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

export default PromotionUpsert;
