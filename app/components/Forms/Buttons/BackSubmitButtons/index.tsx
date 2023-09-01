import { useNavigate } from "@remix-run/react";

type Props = {
  loading?: boolean;
  setLoading?: Function;
};

const BackSubmitButtons = ({ loading = false, setLoading }: Props) => {
  const navigate = useNavigate();
  return (
    <>
      <div className="divider w-full" />
      <div className="flex flex-row items-center justify-center gap-3">
        <button
          type="button"
          className="btn btn-primary w-max"
          onClick={() => navigate("..")}
        >
          Back
        </button>
        <button
          type="submit"
          name="_action"
          value="upsert"
          className="btn btn-primary w-max"
          onClick={() => setLoading && setLoading(true)}
        >
          {loading ? "Loading..." : "Submit"}
        </button>
      </div>
    </>
  );
};

export default BackSubmitButtons;
