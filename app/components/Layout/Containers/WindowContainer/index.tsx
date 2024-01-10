import BasicTitleBar from "~/components/Layout/TitleBars/BasicTitleBar";

type Props = {
  activeTab?: string;
  children: JSX.Element | JSX.Element[];
  extendStyle?: string;
  extendTitleBarStyle?: string;
  hasIsActive?: boolean;
  hasMode?: boolean;
  hideClose?: boolean;
  isActive?: boolean;
  setActiveTab?: (tab: string) => void;
  tabNames?: string[];
  title: string;
};

export const handleWindowedFormData = (
  form: HTMLFormElement
): HTMLFormElement => {
  const openWindow = document.querySelectorAll("#OpenWindowContainer");
  const activeToggle = openWindow[openWindow.length - 1]?.querySelector(
    "#TitlebarActiveToggle"
  );

  if (activeToggle) {
    form.appendChild(activeToggle);
  }

  return form;
};

const WindowContainer = ({
  activeTab,
  children,
  extendStyle,
  extendTitleBarStyle,
  hasIsActive,
  hasMode,
  hideClose,
  isActive,
  setActiveTab,
  tabNames,
  title,
}: Props) => {
  return (
    <div
      id="OpenWindowContainer"
      className={`relative flex max-w-full flex-col gap-3 rounded-sm bg-base-200 p-6 max-md:p-3 ${extendStyle}`}
    >
      <BasicTitleBar
        activeTab={activeTab}
        extendStyle={`${extendTitleBarStyle}`}
        hasIsActive={hasIsActive}
        hasMode={hasMode}
        hideClose={hideClose}
        isActive={isActive}
        setActiveTab={setActiveTab}
        tabNames={tabNames}
        title={title}
      />
      {children}
    </div>
  );
};

export default WindowContainer;
