type Props = {
  title: string;
  content: JSX.Element | JSX.Element[];
};

const LargeCollapse = ({ content, title }: Props) => {
  return (
    <div className="max-w-screen collapse-plus collapse w-full rounded-none bg-base-200 py-3 md:w-[800px]">
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
