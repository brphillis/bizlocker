import WindowTitleBar from "~/components/Layout/TitleBars/WindowTitleBar";

type Props = {
  activeTab?: string;
  children: JSX.Element | JSX.Element[];
  extendStyle?: string;
  extendTitleBarStyle?: string;
  hasDelete?: boolean;
  hasIsActive?: boolean;
  hasMode?: boolean;
  hideClose?: boolean;
  isActive?: boolean;
  onTabChange?: (tab: string) => void;
  tabNames?: string[];
  title: string;
};

const WindowContainer = ({
  activeTab,
  children,
  extendStyle,
  extendTitleBarStyle,
  hasDelete,
  hasIsActive,
  hasMode,
  hideClose,
  isActive,
  onTabChange,
  tabNames,
  title,
}: Props) => {
  return (
    <div
      className={`relative flex max-w-full flex-col gap-3 rounded-sm bg-base-200 p-6 max-md:p-3 ${extendStyle}`}
    >
      <WindowTitleBar
        activeTab={activeTab}
        hasDelete={hasDelete}
        hasIsActive={hasIsActive}
        hideClose={hideClose}
        isActive={isActive}
        onTabChange={onTabChange}
        tabNames={tabNames}
        title={title}
        hasMode={hasMode}
        extendStyle={`${extendTitleBarStyle}`}
      />
      {children}
    </div>
  );
};

export default WindowContainer;
