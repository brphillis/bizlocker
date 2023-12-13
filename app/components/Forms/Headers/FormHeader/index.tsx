import { useNavigate, useParams } from "@remix-run/react";
import { IoMdTrash } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import BasicToggle from "~/components/Forms/Toggle/BasicToggle";
import BoxedTabs from "~/components/Tabs/BoxedTabs";
import { capitalizeFirst } from "~/helpers/stringHelpers";

type ValueToChange<T extends { isActive: boolean }> = T;

type Props = {
  valueToChange?: ValueToChange<any>;
  type: string;
  customMode?: string;
  hasIsActive?: boolean;
  hasDelete?: boolean;
  hasConnections?: boolean;
  tabNames?: string[];
  activeTab?: string;
  onTabChange?: (tab: string) => void;
};

const FormHeader = ({
  valueToChange,
  type,
  customMode,
  hasIsActive,
  hasDelete,
  tabNames,
  activeTab,
  onTabChange,
}: Props) => {
  const navigate = useNavigate();
  const { id } = useParams() || {};

  let mode = id === "add" ? "add" : "edit";

  if (customMode) {
    mode = customMode;
  }

  const handleActiveStatus = (mode: string): boolean => {
    if (mode === "add") {
      return true;
    }
    if (valueToChange && (valueToChange as any)?.isActive) {
      return true;
    } else return false;
  };

  return (
    <>
      <div className="absolute left-[50%] top-0 flex w-full max-w-[100vw] translate-x-[-50%] flex-col items-center border-[1px] border-b-0 border-brand-white bg-primary text-brand-white sm:justify-between">
        <div className="flex w-full items-center justify-between px-6 py-4 max-md:px-3">
          <h1 className="sm:relative sm:left-0 sm:top-0">
            {mode && capitalizeFirst(mode)} {type}
          </h1>

          <div className="flex items-center gap-6">
            {hasIsActive && mode && (
              <div className="-mt-1">
                <BasicToggle
                  label="Active"
                  name="isActive"
                  size="sm"
                  defaultValue={handleActiveStatus(mode)}
                  labelStyle="text-brand-white"
                  extendStyle="ml-3 max-xs:mt-0 mt-[5px] h-1"
                />
              </div>
            )}
            {hasDelete && (
              <button type="submit" name="_action" value="delete">
                <IoMdTrash />
              </button>
            )}
            <button type="button" className="cursor-pointer">
              <IoClose onClick={() => navigate("..", { replace: true })} />
            </button>
          </div>
        </div>

        {activeTab && tabNames && onTabChange && (
          <BoxedTabs
            tabNames={tabNames}
            activeTab={activeTab}
            onTabChange={onTabChange}
          />
        )}
      </div>

      <div className={tabNames ? "h-[90px]" : "h-[45px]"}></div>
    </>
  );
};

export default FormHeader;
