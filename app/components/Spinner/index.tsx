import { IoShirtSharp } from "react-icons/io5";

type Props = {
  mode?: "circle" | "shirt";
  extendStyle?: string;
};

const Spinner = ({ mode, extendStyle }: Props) => {
  return (
    <>
      {!mode ||
        (mode === "circle" && (
          <div
            className="m-6 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
            role="status"
          />
        ))}

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
