type Props = {
  children: JSX.Element | JSX.Element[];
};

const PageWrapper = ({ children }: Props) => {
  return (
    <div className="flex w-full flex-col items-center justify-center bg-base-100 py-0 lg:py-6">
      <>{children}</>
    </div>
  );
};

export default PageWrapper;
