import { useSubmit } from "@remix-run/react";

type Props = {
  extendStyles?: string;
};

const LogoutButton = ({ extendStyles }: Props) => {
  const submit = useSubmit();
  return (
    <button
      className={"btn-primary btn-md !rounded-sm bg-primary " + extendStyles}
      onClick={() => submit(null, { method: "post", action: "/logout" })}
    >
      Log Out
    </button>
  );
};

export default LogoutButton;
