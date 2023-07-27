import React from "react";

type Props = {
  children: JSX.Element | JSX.Element[];
};

const DarkOverlay = ({ children }: Props) => {
  return (
    <div className="absolute inset-0 flex h-screen max-h-screen w-full max-w-[100vw] flex-col items-center justify-start overflow-y-auto bg-black/80 sm:justify-center sm:pt-0">
      {children}
    </div>
  );
};

export default DarkOverlay;
