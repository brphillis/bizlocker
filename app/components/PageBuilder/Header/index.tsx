import { Form } from "@remix-run/react";
import LargeCollapse from "~/components/Collapse/LargeCollapse";
import BasicInput from "~/components/Forms/Input/BasicInput";
import BasicMultiSelect from "~/components/Forms/Select/BasicMultiSelect";
import UploadImage from "~/components/Forms/Upload/UploadImage";
import type { Page } from "~/models/pageBuilder.server";
import type { PageType } from "~/utility/pageBuilder";
import ColorPicker from "~/components/Forms/ColorPicker";

type Props = {
  currentVersion: Page | null;
  pageToCreate: PageType;
  pageType: PageType;
  isActive: string | undefined;
  setIsActive: Function;
  metaValidationError: string[];
  colors: string[];
  articleCategories: SelectValue[];
};

const Header = ({
  currentVersion,
  pageType,
  pageToCreate,
  isActive,
  setIsActive,
  metaValidationError,
  colors,
  articleCategories,
}: Props) => {
  return (
    <LargeCollapse
      title="Meta"
      content={
        <Form
          method="POST"
          className="relative flex w-full flex-col items-center gap-6 max-md:px-3"
        >
          {pageType !== "homePage" && (
            <>
              <label className="label absolute -top-11 right-16 z-10 mt-0 h-1 cursor-pointer max-md:-top-9 sm:mt-1">
                <input
                  type="checkbox"
                  className="toggle toggle-sm ml-3"
                  checked={isActive ? true : false}
                  onChange={(e) =>
                    setIsActive(e.target.checked ? "true" : undefined)
                  }
                />
                <span className="label-text ml-3 text-brand-white">Active</span>
              </label>
              <input name="isActive" value={isActive || ""} readOnly hidden />
            </>
          )}

          <BasicInput
            customWidth="w-[320px]"
            defaultValue={currentVersion?.title}
            label="Title"
            labelStyle="text-brand-white"
            name="title"
            placeholder="Title"
            type="text"
          />

          <div className="form-control">
            <label className="label">
              <span className="label-text text-brand-white">Description</span>
            </label>
            <textarea
              className="textarea textarea-bordered flex w-[95vw] rounded-sm text-brand-black sm:w-[320px]"
              defaultValue={currentVersion?.description}
              name="description"
              placeholder="Description"
            />
          </div>

          {(pageToCreate === "article" || pageType === "article") && (
            <BasicMultiSelect
              customWidth="w-[320px]"
              defaultValues={(currentVersion as any)?.articleCategories}
              label="Categories"
              labelStyle="text-brand-white"
              name="articleCategories"
              selections={articleCategories}
            />
          )}

          <ColorPicker
            customWidth="w-[320px]"
            defaultValue={currentVersion?.backgroundColor || undefined}
            extendStyle="max-md:!px-0"
            formName="backgroundColor"
            label="Background Color"
            type="bg"
          />

          {pageType !== "homePage" && (
            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text text-brand-white">Thumbnail</span>
              </label>
              <div className="max-w-[500px]">
                <UploadImage
                  defaultValue={currentVersion?.thumbnail}
                  name="thumbnail"
                />
              </div>
            </div>
          )}

          <input
            name="previewPageId"
            value={currentVersion?.id}
            hidden
            readOnly
          />
          <input name="_action" value="updateMeta" hidden readOnly />

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

export default Header;
