type Props = {
  title: string;
  content: JSX.Element | JSX.Element[];
  forceOpen?: boolean;
  forceClose?: boolean;
};

const LargeCollapse = ({ content, title, forceOpen, forceClose }: Props) => {
  return (
    <div
      className={`collapse collapse-plus w-full max-w-full rounded-none bg-brand-black py-3 text-brand-white md:w-[800px] 
        ${forceOpen ? " collapse-open " : ""} 
        ${forceClose ? " collapse-close " : ""}
        `}
    >
      <input type="checkbox" readOnly />
      <div className="collapse-title text-xl font-medium">
        <div className="ml-3 flex items-center gap-3">
          <p>{title}</p>
        </div>
      </div>
      <div className="collapse-content max-w-full sm:w-full">
        <div className="flex justify-center px-3">{content}</div>
      </div>
    </div>
  );
};

export default LargeCollapse;
