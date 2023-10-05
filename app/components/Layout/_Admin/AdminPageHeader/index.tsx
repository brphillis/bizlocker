import { useNavigate } from "@remix-run/react";

type Props = {
  title: string;
  addButtonText?: string;
  createLink?: string;
};

const AdminPageHeader = ({ title, addButtonText, createLink }: Props) => {
  const navigate = useNavigate();
  return (
    <>
      <div className="flex w-full items-center justify-between">
        <h1>{title}</h1>
        {addButtonText && (
          <button
            type="button"
            className="btn-primary btn-md w-max !rounded-sm"
            onClick={() => navigate(createLink ? createLink : "add")}
          >
            {addButtonText}
          </button>
        )}
      </div>
      <div className="divider w-full" />
    </>
  );
};

export default AdminPageHeader;
