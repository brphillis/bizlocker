type Props = {
  title: string;
  content: JSX.Element | JSX.Element[];
  forceOpen?: boolean;
  forceClose?: boolean;
};

const LargeCollapse = ({ content, title, forceOpen, forceClose }: Props) => {
  return (
    <div
      className={`max-w-screen collapse-plus collapse w-full rounded-none rounded-t-none bg-brand-black py-3 text-brand-white sm:rounded-b-md sm:rounded-t-md md:w-[800px] 
        ${forceOpen && " collapse-open "} 
        ${forceClose && " collapse-close "}
        `}
    >
      <input type="checkbox" readOnly />
      <div className="collapse-title text-xl font-medium">
        <div className="ml-3 flex items-center gap-3">
          <p>{title}</p>
        </div>
      </div>
      <div className="collapse-content w-screen sm:w-full">
        <div className="flex justify-center">{content}</div>
      </div>
    </div>
  );
};

export default LargeCollapse;
