import { Form } from "@remix-run/react";

type Props = {
  children: JSX.Element | JSX.Element[];
  sloganText?: string;
};

const AuthContainer = ({ children, sloganText }: Props) => {
  return (
    <Form
      method="POST"
      className="w-max-content form-control relative w-[24rem] max-w-[98vw] rounded-lg bg-brand-black p-8 text-brand-white"
    >
      <h1 className="select-none pb-6 pt-3 text-center text-6xl font-bold tracking-wide text-white/90">
        CLUTCH
      </h1>
      {sloganText && <p className="mb-3 text-center text-xs">{sloganText}</p>}

      {children}
    </Form>
  );
};

export default AuthContainer;
