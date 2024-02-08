import { getThemeColorValueByName } from "~/utility/colors";

type Props = {
  backgroundColor?: string | null;
  children: JSX.Element | JSX.Element[];
  gap?: "small" | "medium" | "large";
};

const PageWrapper = ({ backgroundColor, children, gap }: Props) => {
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
    <div
      style={{
        backgroundColor: backgroundColor
          ? getThemeColorValueByName(backgroundColor)
          : getThemeColorValueByName("brand-white"),
      }}
      className={`mb-[-1px] flex w-full flex-col items-center justify-center pt-6 pb-6 max-md:pt-3`}
    >
      <div
        className={`relative flex w-[1280px] max-w-full flex-col items-center max-md:w-full max-md:gap-3 ${amount}`}
      >
        {children}
      </div>
    </div>
  );
};

export default PageWrapper;
