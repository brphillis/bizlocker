type Props = {
  children: JSX.Element | JSX.Element[];
  gap?: "small" | "medium" | "large";
};

const PageWrapper = ({ children, gap }: Props) => {
  let amount = "gap-3";

  switch (gap) {
    case "small":
      amount = "gap-3";
      break;

    case "medium":
      amount = "gap-6";
      break;

    case "large":
      amount = "gap-9";
      break;

    default:
      amount = "gap-3";
  }

  return (
    <div className="flex w-full flex-col items-center justify-center bg-base-100 pt-6 max-sm:pt-3 lg:pb-12">
      <div
        className={
          "flex w-full max-w-full flex-col gap-3 sm:w-[1280px] " +
          "sm:" +
          amount
        }
      >
        {children}
      </div>
    </div>
  );
};

export default PageWrapper;
