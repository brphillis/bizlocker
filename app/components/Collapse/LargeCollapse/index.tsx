type Props = {
  title: string;
  content: JSX.Element | JSX.Element[];
  forceOpen?: boolean;
  forceClose?: boolean;
};

const LargeCollapse = ({ content, title, forceOpen, forceClose }: Props) => {
  return (
    <div
      className={`collapse w-[800px] max-w-full rounded-sm bg-brand-black py-3 text-brand-white max-md:w-screen
        ${forceOpen ? " collapse-open " : "collapse-plus"} 
        ${forceClose ? " collapse-close " : ""}
        `}
    >
      <input type="checkbox" readOnly />
      <div className="collapse-title text-xl font-medium">
        <div className="ml-3 flex items-center gap-3">
          <p>{title}</p>
        </div>
      </div>
      <div className="collapse-content relative max-w-full sm:w-full">
        <div className="flex justify-center">{content}</div>
      </div>
    </div>
  );
};

export default LargeCollapse;
