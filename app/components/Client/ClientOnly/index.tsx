import { useState, useEffect } from "react";

type Props = {
  children:
    | JSX.Element
    | JSX.Element[]
    | (() => JSX.Element)
    | (() => JSX.Element[]);
  fallback?: React.ReactNode;
};

let hydrating = true;

export function ClientOnly({ children, fallback = null }: Props) {
  const [hydrated, setHydrated] = useState(() => !hydrating);

  useEffect(() => {
    hydrating = false;
    setHydrated(true);
  }, []);

  return hydrated ? (
    <>{typeof children === "function" ? children() : children}</>
  ) : (
    <>{fallback}</>
  );
}
