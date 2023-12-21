import { getThemeColorValueByName } from "~/utility/colors";

type Props = {
  children: JSX.Element | JSX.Element[];
  gap?: "small" | "medium" | "large";
  noTopPadding?: boolean;
  backgroundColor?: string | null;
};

const PageWrapper = ({
  children,
  gap,
  noTopPadding,
  backgroundColor,
}: Props) => {
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
      className={`mb-[-1px] flex w-full flex-col items-center justify-center pb-3 pt-6 max-md:pt-3 lg:pb-12 ${
        noTopPadding && "!pt-0"
      }`}
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
