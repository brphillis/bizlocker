import { useEffect } from "react";
import { PreviewPage } from "@prisma/client";
import { useSubmit } from "@remix-run/react";
import { PageType } from "~/utility/pageBuilder";
import { Page } from "~/models/PageBuilder/types";
import BasicButton from "~/components/Buttons/BasicButton";
import SquareIconButton from "~/components/Buttons/SquareIconButton";
import { formatDate, isMostRecentDate } from "~/helpers/dateHelpers";

type Props = {
  currentVersion: Page | null;
  loading: boolean;
  pageType: PageType;
  previewPages?: PreviewPage[] | null;
  publishedPage: Page;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  updateSuccess: boolean;
};

const VersionControl = ({
  currentVersion,
  loading,
  pageType,
  previewPages,
  publishedPage,
  setLoading,
  updateSuccess,
}: Props) => {
  const submit = useSubmit();

  const publishedDates = previewPages?.map((e) => e.publishedAt);

  const handlePublish = () => {
    setLoading(true);

    const formData = new FormData();
    formData.set("_action", "publish");
    formData.set("pageId", publishedPage?.id?.toString());
    formData.set("pageType", pageType);

    if (currentVersion?.id) {
      formData.set("previewPageId", currentVersion?.id?.toString());
    }

    submit(formData, { method: "POST" });
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
    // change selected option to newly published option
    if (updateSuccess) {
      const versionSelector = document.querySelector(
        "#VersionSelector",
      ) as HTMLSelectElement;
      for (let i = 0; i < versionSelector.options.length; i++) {
        if (versionSelector.options[i].text.includes("Current")) {
          versionSelector.value = versionSelector.options[i].value;
          break;
        }
      }
    }
  }, [updateSuccess]);

  useEffect(() => {
    setLoading(false);
  }, [updateSuccess, currentVersion, setLoading]);

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
            {previewPages
              ?.slice()
              .sort(
                (a: PreviewPage, b: PreviewPage) =>
                  (Number(b.publishedAt) || 0) - (Number(a.publishedAt) || 0),
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
              window.open(`/preview?id=${currentVersion?.id}`, "_blank");
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
