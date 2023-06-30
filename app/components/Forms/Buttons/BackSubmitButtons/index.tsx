import { useNavigate } from "@remix-run/react";

const BackSubmitButtons = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className="divider w-full" />
      <div className="flex flex-row items-center justify-center gap-3">
        <button
          type="button"
          className="btn-primary btn w-max"
          onClick={() => navigate("..")}
        >
          Back
        </button>
        <button
          type="submit"
          name="_action"
          value="upsert"
          className="btn-primary btn w-max"
        >
          Submit
        </button>
      </div>
    </>
  );
};

export default BackSubmitButtons;
