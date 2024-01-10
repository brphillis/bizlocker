import { useNavigate, useSearchParams } from "@remix-run/react";
import { IoClose } from "react-icons/io5";
import BasicToggle from "~/components/Forms/Toggle/BasicToggle";
import BoxedTabs from "~/components/Tabs/BoxedTabs";
import { capitalizeFirst } from "~/helpers/stringHelpers";

type Props = {
  activeTab?: string;
  extendStyle?: string;
  hasIsActive?: boolean;
  hasMode?: boolean;
  hideClose?: boolean;
  isActive?: boolean;
  setActiveTab?: (tab: string) => void;
  tabNames?: string[];
  title: string;
};

const BasicTitleBar = ({
  activeTab,
  extendStyle,
  hasIsActive,
  hasMode,
  hideClose,
  isActive,
  setActiveTab,
  tabNames,
  title,
}: Props) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const contentId = searchParams.get("contentId");

  let mode = contentId === "add" ? "add" : "edit";

  const handleActiveStatus = (mode: string): boolean => {
    if (mode === "add") {
      return true;
    }
    if (isActive) {
      return true;
    } else return false;
  };

  return (
    <>
      <div
        className={`absolute left-[50%] top-0 flex w-full max-w-[100vw] translate-x-[-50%] flex-col items-center border-[1px] border-b-0 border-brand-white bg-primary text-brand-white sm:justify-between ${extendStyle}`}
      >
        <div className="flex w-full items-center justify-between px-6 py-4 max-md:px-3">
          <h1 className="font-semibold tracking-wide sm:relative sm:left-0 sm:top-0">
            {mode && hasMode && capitalizeFirst(mode)} {capitalizeFirst(title)}
          </h1>

          <div className="flex items-center gap-6">
            {hasIsActive && mode && (
              <div className="-mt-1">
                <BasicToggle
                  id="TitlebarActiveToggle"
                  label="Active"
                  name="isActive"
                  size="sm"
                  defaultValue={handleActiveStatus(mode)}
                  labelStyle="text-brand-white"
                  extendStyle="ml-3 max-xs:mt-0 mt-[5px] h-1"
                />
              </div>
            )}
            {!hideClose && (
              <button type="button" className="cursor-pointer">
                <IoClose onClick={() => navigate(-1)} />
              </button>
            )}
          </div>
        </div>

        {activeTab && tabNames && setActiveTab && (
          <BoxedTabs
            tabNames={tabNames}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        )}
      </div>

      <div className={tabNames ? "h-[90px]" : "h-[45px]"}></div>
    </>
  );
};

export default BasicTitleBar;
