import type { Page } from "~/models/pageBuilder.server";
import type { PreviewPage } from "@prisma/client";
import { useSubmit } from "@remix-run/react";
import { useEffect, useState } from "react";
import SquareIconButton from "~/components/Buttons/SquareIconButton";
import { formatDate, isMostRecentDate } from "~/helpers/dateHelpers";
import type { PageType } from "~/utility/pageBuilder";
import BasicButton from "~/components/Buttons/BasicButton";

type Props = {
  currentVersion: Page | null;
  previewPages?: PreviewPage[] | null;
  publishedPage: Page;
  pageType: PageType;
  updateSuccess: boolean;
};

const VersionControl = ({
  currentVersion,
  previewPages,
  publishedPage,
  updateSuccess,
  pageType,
}: Props) => {
  const submit = useSubmit();

  const [loading, setLoading] = useState<boolean>(false);

  const publishedDates = previewPages?.map((e) => e.publishedAt);

  const handlePublish = () => {
    if (currentVersion?.id) {
      setLoading(true);

      const formData = new FormData();
      formData.set("_action", "publish");
      formData.set("pageId", publishedPage?.id?.toString());
      formData.set("previewPageId", currentVersion?.id?.toString());
      formData.set("pageType", pageType);

      submit(formData, { method: "POST" });
    }
  };

  const handleRevert = () => {
    if (currentVersion?.id) {
      setLoading(true);

      const formData = new FormData();
      formData.set("_action", "revert");
      formData.set("pageId", publishedPage?.id?.toString());
      formData.set("previewPageId", currentVersion?.id?.toString());
      formData.set("pageType", pageType);

      submit(formData, { method: "POST" });
    }
  };

  const handleDelete = () => {
    if (currentVersion?.id) {
      setLoading(true);

      const formData = new FormData();
      formData.set("_action", "deletepreview");
      formData.set("previewPageId", currentVersion?.id?.toString());

      submit(formData, { method: "POST" });
    }
  };

  const handleAddPreview = () => {
    if (currentVersion?.id) {
      setLoading(true);

      const formData = new FormData();
      formData.set("_action", "addpreview");
      formData.set("pageId", publishedPage?.id?.toString());
      formData.set("pageType", pageType);

      submit(formData, { method: "POST" });
    }
  };

  useEffect(() => {
    setLoading(false);

    // change selected option to newly published option
    if (updateSuccess) {
      const versionSelector = document.querySelector(
        "#VersionSelector",
      ) as HTMLSelectElement;
      for (var i = 0; i < versionSelector.options.length; i++) {
        if (versionSelector.options[i].text.includes("Current")) {
          versionSelector.value = versionSelector.options[i].value;
          break;
        }
      }
    }
  }, [updateSuccess]);

  return (
    <div
      className="relative flex flex-col items-center justify-center gap-3 px-3 pt-6 pb-3
       bg-brand-black text-center text-xl font-bold text-brand-white border-t border-t-brand-white/25"
    >
      <div className="flex flex-col items-center gap-3">
        <div className="flex items-center gap-3">
          <SquareIconButton
            iconName="IoTrashBin"
            size="small"
            color="error"
            onClick={handleDelete}
          />

          <select
            id="VersionSelector"
            className="select select-sm !h-[32px] !min-h-[32px] w-full max-w-xs text-brand-black/75 max-md:max-w-[240px] min-w-[192px]"
            onChange={(e) => {
              const formData = new FormData();
              formData.set("_action", "changecurrentpreview");
              formData.set("pageId", e.target.value);
              submit(formData, { method: "POST" });
            }}
            defaultValue={previewPages?.[0]?.id}
          >
            {previewPages &&
              previewPages
                .slice()
                .sort(
                  (a: any, b: any) =>
                    (b.publishedAt || 0) - (a.publishedAt || 0),
                )
                .map((previewPageData: PreviewPage, i: number) => {
                  const { id, publishedAt } = previewPageData;
                  const publishedDate = publishedAt
                    ? formatDate(publishedAt, true)
                    : "unpublished";

                  let isMostRecentlyPublished = false;

                  if (
                    publishedDates &&
                    publishedAt &&
                    isMostRecentDate(publishedAt, publishedDates)
                  ) {
                    isMostRecentlyPublished = true;
                  }

                  const optionLabel = isMostRecentlyPublished
                    ? "Current"
                    : "Previous";

                  return (
                    <option key={"preivewPageVersionSelection_" + i} value={id}>
                      {optionLabel}: {publishedDate}
                    </option>
                  );
                })}
          </select>

          <SquareIconButton
            iconName="IoAdd"
            size="small"
            color="primary"
            onClick={handleAddPreview}
          />
        </div>

        <div className="w-full select-none py-1 text-xs text-brand-white/75">
          Last Published by : {currentVersion?.publisher}
        </div>
      </div>

      <div className="flex flex-row justify-center gap-3">
        <BasicButton label="Revert" onClick={handleRevert} disabled={loading} />

        <button
          type="button"
          className={`btn-primary btn-md flex w-max items-center justify-center !rounded-sm 
          bg-primary hover:bg-primary-dark`}
          onClick={() => {
            if (!loading) {
              window.open(`/preview/${currentVersion?.id}`, "_blank");
            }
          }}
        >
          {loading ? "Loading..." : "Preview"}
        </button>

        <BasicButton
          label={loading ? "Loading..." : "Publish"}
          onClick={handlePublish}
          disabled={loading}
        />
      </div>
    </div>
  );
};

export default VersionControl;
