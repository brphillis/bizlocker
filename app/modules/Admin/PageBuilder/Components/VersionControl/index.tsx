import type { Page } from "~/models/pageBuilder.server";
import type { PreviewPage } from "@prisma/client";
import { Form, useSubmit } from "@remix-run/react";
import { useEffect, useState } from "react";
import SquareIconButton from "~/components/Buttons/SquareIconButton";
import Spinner from "~/components/Spinner";
import { formatDate, isMostRecentDate } from "~/helpers/dateHelpers";

type Props = {
  currentVersion: Page | null;
  previewPages?: PreviewPage[] | null;
  page: Page;
  updateSuccess: boolean;
};

const VersionControl = ({
  currentVersion,
  previewPages,
  page,
  updateSuccess,
}: Props) => {
  const submit = useSubmit();

  const [loading, setLoading] = useState<boolean>(false);

  const publishedDates = previewPages?.map((e) => e.publishedAt);

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
    <div className="relative flex flex-col items-center justify-center gap-3 bg-brand-black py-6 text-center text-xl font-bold text-brand-white">
      <div className="self-start pb-3 pl-6 text-xl font-medium">Version</div>
      <div className="flex flex-col items-center gap-3">
        <Form method="POST" className="flex items-center gap-3">
          <SquareIconButton
            iconName="IoTrashBin"
            size="small"
            color="error"
            type="submit"
            name="_action"
            value="deletepreview"
          />

          <select
            id="VersionSelector"
            className="select select-sm !h-[32px] !min-h-[32px] w-full max-w-xs text-brand-black/75 max-md:max-w-[240px]"
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
                    ? "Current Version"
                    : "Previous Version";

                  return (
                    <option key={"preivewPageVersionSelection_" + i} value={id}>
                      {optionLabel}: {publishedDate}
                    </option>
                  );
                })}
          </select>

          <input hidden readOnly name="pageId" value={page?.id?.toString()} />
          <input
            hidden
            readOnly
            name="previewPageId"
            value={currentVersion?.id?.toString()}
          />

          <SquareIconButton
            iconName="IoAdd"
            size="small"
            color="primary"
            type="submit"
            name="_action"
            value="addpreview"
          />
        </Form>

        <div className="w-full select-none py-1 text-xs text-brand-white/75">
          Last Published by : {currentVersion?.publisher}
        </div>
      </div>

      <Form method="POST" className="flex flex-row justify-center gap-3">
        <input
          hidden
          readOnly
          name="previewPageId"
          value={currentVersion?.id?.toString()}
        />
        <input hidden readOnly name="pageId" value={page?.id?.toString()} />

        <button
          type="submit"
          name="_action"
          value="revert"
          className={`btn-primary btn-md block w-max !rounded-sm bg-primary hover:bg-primary-dark ${
            loading && "hidden"
          }`}
        >
          Revert
        </button>

        <a
          type="button"
          className={`btn-primary btn-md flex w-max items-center justify-center !rounded-sm bg-primary hover:bg-primary-dark ${
            loading && "hidden"
          }`}
          target="_blank"
          rel="noreferrer"
          href={`/preview/${currentVersion?.id}`}
        >
          {loading ? "Loading..." : "Preview"}
        </a>
        <button
          type="submit"
          name="_action"
          value="publish"
          className={`btn-primary btn-md block w-max !rounded-sm bg-primary hover:bg-primary-dark ${
            loading && "hidden"
          }`}
          onClick={() => setLoading(true)}
        >
          {loading ? "Loading..." : "Publish"}
        </button>

        {loading && <Spinner mode="circle" />}
      </Form>
    </div>
  );
};

export default VersionControl;
