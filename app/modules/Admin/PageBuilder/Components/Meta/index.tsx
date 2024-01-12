import { Form, useSearchParams } from "@remix-run/react";
import LargeCollapse from "~/components/Collapse/LargeCollapse";
import BasicInput from "~/components/Forms/Input/BasicInput";
import BasicMultiSelect from "~/components/Forms/Select/BasicMultiSelect";
import UploadImage from "~/components/Forms/Upload/UploadImage";
import type { Page } from "~/models/pageBuilder.server";
import type { PageType } from "~/utility/pageBuilder";
import ColorPicker from "~/components/Forms/ColorPicker";
import IsActiveToggle from "~/components/Forms/Toggle/IsActiveToggle";
import BasicTextArea from "~/components/Forms/TextArea/BasicInput";

type Props = {
  currentVersion: Page | null;
  pageType: PageType;
  metaValidationError: string[];
  colors: string[];
  articleCategories: SelectValue[];
};

const Meta = ({
  currentVersion,
  pageType,
  metaValidationError,
  articleCategories,
}: Props) => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  return (
    <LargeCollapse
      title="Meta & Settings"
      forceOpen={id === "add" ? true : false}
      content={
        <Form
          method="POST"
          className="relative flex w-full flex-col items-center gap-6 max-md:px-3"
        >
          <input
            name="previewPageId"
            value={currentVersion?.id}
            hidden
            readOnly
          />
          <input name="_action" value="updateMeta" hidden readOnly />

          <div className="flex flex-col gap-3 items-start">
            <div className="flex flex-row gap-3 flex-wrap w-max max-md:w-full">
              <BasicInput
                customWidth="w-[320px] max-md:w-full"
                defaultValue={currentVersion?.title}
                label="Title"
                labelStyle="text-brand-white"
                name="title"
                placeholder="Title"
                type="text"
              />

              <ColorPicker
                customWidth="w-[320px] max-md:w-full"
                defaultValue={currentVersion?.backgroundColor || undefined}
                extendStyle="max-md:!px-0"
                formName="backgroundColor"
                label="Background Color"
                type="bg"
              />
            </div>

            <div className="flex flex-row gap-3 w-full flex-wrap">
              <BasicTextArea
                label="Description"
                name="description"
                placeholder="Description"
                defaultValue={currentVersion?.description}
                labelStyle="text-brand-white"
                customWidth={
                  pageType === "article" ? "w-[320px] max-md:w-full" : "w-full"
                }
                extendStyle="h-[82px]"
              />

              {pageType === "article" && (
                <BasicMultiSelect
                  customWidth="w-[320px]"
                  defaultValues={(currentVersion as any)?.articleCategories}
                  label="Categories"
                  labelStyle="text-brand-white"
                  name="articleCategories"
                  selections={articleCategories}
                />
              )}
            </div>

            {pageType !== "homePage" && (
              <IsActiveToggle
                isActive={currentVersion?.isActive}
                labelStyle="text-brand-white"
                size="sm"
              />
            )}

            <div className="w-full flex justify-center">
              {pageType !== "homePage" && (
                <div className="form-control w-full max-w-xs mb-3">
                  <label className="label">
                    <span className="label-text text-brand-white">
                      Thumbnail
                    </span>
                  </label>
                  <div className="max-w-[500px]">
                    <UploadImage
                      defaultValue={currentVersion?.thumbnail}
                      name="thumbnail"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {metaValidationError && metaValidationError?.length > 0 && (
            <div className="pb-3">
              {metaValidationError.map((error: string, i: number) => {
                return (
                  <p
                    key={error + i}
                    className="my-2 text-center text-xs text-red-500"
                  >
                    {error}
                  </p>
                );
              })}
            </div>
          )}

          <button
            type="submit"
            className="btn-primary btn-md  mx-auto block w-max !rounded-sm bg-primary hover:bg-primary-dark"
          >
            {currentVersion ? "Submit" : "Next Step"}
          </button>
        </Form>
      }
    />
  );
};

export default Meta;
