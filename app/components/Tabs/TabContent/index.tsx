type Props = {
  tab: string;
  activeTab: string | undefined;
  children: JSX.Element | JSX.Element[];
  extendStyle?: string;
};

const TabContent = ({ children, activeTab, tab, extendStyle }: Props) => {
  return (
    <div
      data-tabname={tab}
      className={`form-control relative  ${
        activeTab !== tab && "hidden"
      } ${extendStyle}`}
    >
      {children}
    </div>
  );
};

export default TabContent;
