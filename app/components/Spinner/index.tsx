import { IoShirtSharp } from "react-icons/io5";

type Props = {
  mode: "circle" | "shirt";
  size?: "extraSmall" | "small" | "medium" | "large";
  extendStyle?: string;
};

const Spinner = ({ mode, size, extendStyle }: Props) => {
  return (
    <>
      {mode === "circle" && !size && (
        <div
          className={
            "m-6 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" +
            extendStyle
          }
          role="status"
        />
      )}

      {mode === "circle" && size === "small" && (
        <div
          className={`mx-3 h-6 w-6 animate-spin rounded-full border-[3px] border-white/0 border-t-primary ${extendStyle}`}
        />
      )}

      {mode === "circle" && size === "extraSmall" && (
        <div
          className={`h-3 w-3 animate-spin rounded-full border-[2px] border-white/0 border-t-primary ${extendStyle}`}
        />
      )}

      {mode === "shirt" && (
        <div
          className={
            "m-6 inline-block animate-ping rounded-full bg-primary p-2 " +
            extendStyle
          }
          role="status"
        >
          <IoShirtSharp size={24} />
        </div>
      )}
    </>
  );
};

export default Spinner;
