import { useNavigate } from "@remix-run/react";

type Props = {
  title: string;
  buttonLabel?: string;
  buttonLink?: string;
};

const AdminPageHeader = ({ title, buttonLabel, buttonLink }: Props) => {
  const navigate = useNavigate();
  return (
    <>
      <div className="flex w-full items-center justify-between">
        <h1>{title}</h1>
        {buttonLabel && buttonLink && (
          <button
            type="button"
            className="btn-primary btn-md w-max !rounded-sm bg-primary hover:bg-primary-dark"
            onClick={() => buttonLink && navigate(buttonLink)}
          >
            {buttonLabel}
          </button>
        )}
      </div>
      <div className="divider w-full" />
    </>
  );
};

export default AdminPageHeader;
