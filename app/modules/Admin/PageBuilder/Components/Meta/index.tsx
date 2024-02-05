import { PageType } from "~/utility/pageBuilder";
import { Page } from "~/models/PageBuilder/types";
import BasicTextArea from "~/components/Forms/TextArea";
import ColorPicker from "~/components/Forms/ColorPicker";
import BasicButton from "~/components/Buttons/BasicButton";
import BasicInput from "~/components/Forms/Input/BasicInput";
import { useSearchParams, useSubmit } from "@remix-run/react";
import UploadImage from "~/components/Forms/Upload/UploadImage";
import IsActiveToggle from "~/components/Forms/Toggle/IsActiveToggle";
import BasicMultiSelect from "~/components/Forms/Select/BasicMultiSelect";

type Props = {
  currentVersion: Page | null;
  pageType: PageType;
  metaValidationError: string[];
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

    if (currentVersion?.id) {
      formData.set("previewPageId", currentVersion?.id?.toString());
    }

    submit(formData, { method: "POST" });
  };

  return (
    <div
      id="PageSettingsContainer"
      className="relative flex w-full flex-col items-center gap-6 max-md:px-3"
    >
      <div className="flex flex-col gap-3 pt-3 w-full items-center px-3">
        {id === "add" && (
          <div className="text-brand-white text-center w-full">Add a Page</div>
        )}

        <BasicInput
          id="PageMetaTitle"
          extendContainerStyle="w-[320px] max-md:w-full"
          defaultValue={currentVersion?.title}
          label="Title"
          labelStyle="text-brand-white"
          name="title"
          placeholder="Title"
          type="text"
        />

        <ColorPicker
          id="PageBackgroundColor"
          extendStyle="w-[320px] max-md:w-full"
          defaultValue={currentVersion?.backgroundColor || undefined}
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
          extendContainerStyle="w-full px-2 max-md:px-0"
          extendStyle="h-[82px]"
        />

        {pageType === "article" && (
          <BasicMultiSelect
            id="PageArticleCategories"
            extendContainerStyle="w-[320px]"
            defaultValues={currentVersion?.articleCategories}
            label="Categories"
            labelStyle="text-brand-white"
            name="articleCategories"
            selections={articleCategories}
          />
        )}

        {pageType !== "homePage" && (
          <div className="w-full flex justify-start pl-3">
            <IsActiveToggle
              id="PageIsActive"
              isActive={currentVersion?.isActive}
              labelStyle="text-brand-white"
              size="sm"
            />
          </div>
        )}

        <div className="w-full flex justify-center">
          {pageType !== "homePage" && (
            <div className="form-control w-full max-w-xs mb-3">
              <div className="label">
                <span className="label-text text-brand-white">Thumbnail</span>
              </div>
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

      <BasicButton label="Submit" onClick={() => handleUpdateMeta()} />
    </div>
  );
};

export default Meta;
