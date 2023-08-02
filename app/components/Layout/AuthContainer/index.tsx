import { Form } from "@remix-run/react";

type Props = {
  children: JSX.Element | JSX.Element[];
};

const AuthPageWrapper = ({ children }: Props) => {
  return (
    <Form
      method="POST"
      className="w-max-content form-control relative w-[24rem] max-w-[98vw] rounded-lg bg-brand-black p-8 text-brand-white"
    >
      <h1 className="select-none pb-6 pt-3 text-center text-6xl font-bold tracking-wide text-white/90">
        CLUTCH
      </h1>
      {children}
    </Form>
  );
};

export default AuthPageWrapper;
