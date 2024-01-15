import { useSearchParams, useSubmit } from "@remix-run/react";
import BasicInput from "~/components/Forms/Input/BasicInput";
import BasicMultiSelect from "~/components/Forms/Select/BasicMultiSelect";
import UploadImage from "~/components/Forms/Upload/UploadImage";
import type { Page } from "~/models/pageBuilder.server";
import type { PageType } from "~/utility/pageBuilder";
import ColorPicker from "~/components/Forms/ColorPicker";
import IsActiveToggle from "~/components/Forms/Toggle/IsActiveToggle";
import BasicTextArea from "~/components/Forms/TextArea/BasicInput";
import BasicButton from "~/components/Buttons/BasicButton";

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
  const submit = useSubmit();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  const handleUpdateMeta = () => {
    const title = (document.querySelector("#PageMetaTitle") as HTMLInputElement)
      ?.value;
    const description = (
      document.querySelector("#PageMetaDescription") as HTMLInputElement
    )?.value;
    const backgroundColor = (
      document.querySelector("#PageBackgroundColor") as HTMLInputElement
    )?.value;
    const isActive = (
      document.querySelector("#PageIsActive") as HTMLInputElement
    )?.value;
    const thumbnail = (
      document.querySelector("#PageThumbnail") as HTMLInputElement
    )?.value;
    const pageArticleCategories = (
      document.querySelector("#PageArticleCategories") as HTMLInputElement
    )?.value;

    if (currentVersion?.id) {
      const formData = new FormData();
      formData.set("_action", "updateMeta");
      formData.set("pageType", pageType);
      title && formData.set("title", title);
      description && formData.set("description", description);
      backgroundColor && formData.set("backgroundColor", backgroundColor);
      isActive && formData.set("isActive", isActive);
      thumbnail && formData.set("thumbnail", thumbnail);
      pageArticleCategories &&
        pageArticleCategories &&
        formData.set("articleCategories", pageArticleCategories);
      formData.set("previewPageId", currentVersion?.id?.toString());

      submit(formData, { method: "POST" });
    }
  };

  return (
    <div
      id="PageSettingsContainer"
      className="relative flex w-full flex-col items-center gap-6 max-md:px-3"
    >
      <div className="flex flex-col gap-3 items-start pt-3">
        {id === "add" && (
          <div className="text-brand-white text-center w-full">Add a Page</div>
        )}

        <BasicInput
          id="PageMetaTitle"
          customWidth="w-[320px] max-md:w-full"
          defaultValue={currentVersion?.title}
          label="Title"
          labelStyle="text-brand-white"
          name="title"
          placeholder="Title"
          type="text"
        />

        <ColorPicker
          id="PageBackgroundColor"
          customWidth="w-[320px] max-md:w-full"
          defaultValue={currentVersion?.backgroundColor || undefined}
          extendStyle="max-md:!px-0"
          formName="backgroundColor"
          label="Background Color"
          type="bg"
        />

        <BasicTextArea
          id="PageMetaDescription"
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
            id="PageArticleCategories"
            customWidth="w-[320px]"
            defaultValues={(currentVersion as any)?.articleCategories}
            label="Categories"
            labelStyle="text-brand-white"
            name="articleCategories"
            selections={articleCategories}
          />
        )}

        {pageType !== "homePage" && (
          <IsActiveToggle
            id="PageIsActive"
            isActive={currentVersion?.isActive}
            labelStyle="text-brand-white"
            size="sm"
          />
        )}

        <div className="w-full flex justify-center">
          {pageType !== "homePage" && (
            <div className="form-control w-full max-w-xs mb-3">
              <label className="label">
                <span className="label-text text-brand-white">Thumbnail</span>
              </label>
              <div className="max-w-[500px]">
                <UploadImage
                  id="PageThumbnail"
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

      <BasicButton label="Submit" onClick={handleUpdateMeta} />
    </div>
  );
};

export default Meta;
