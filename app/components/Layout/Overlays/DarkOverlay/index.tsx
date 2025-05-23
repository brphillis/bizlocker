import { useEffect, useState } from "react";

type Props = {
  children: JSX.Element | JSX.Element[];
  fadeIn?: boolean;
};

const DarkOverlay = ({ children, fadeIn }: Props) => {
  const [fadeClass, setFadeClass] = useState<string>("");

  useEffect(() => {
    if (fadeIn) {
      const timeout = setTimeout(() => {
        setFadeClass(" transition-all duration-500 ease-in-out opacity-100");
      }, 100);
      return () => clearTimeout(timeout);
    } else {
      setFadeClass(" !opacity-100");
    }
  }, [fadeIn]);

  return (
    <div
      className={
        "absolute inset-0 z-50 flex h-full w-full max-w-[100vw] flex-col items-center justify-start overflow-y-auto bg-black/90 pt-6 opacity-0 max-md:pt-0" +
        fadeClass
      }
    >
      {children}
    </div>
  );
};

export default DarkOverlay;
