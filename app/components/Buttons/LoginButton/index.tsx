import { useNavigate } from "@remix-run/react";

type Props = {
  style?: string;
};

const LoginButton = ({ style }: Props) => {
  const navigate = useNavigate();
  return (
    <button
      className={"btn-primary btn-md " + style}
      onClick={() => navigate("/login")}
    >
      Login
    </button>
  );
};

export default LoginButton;
