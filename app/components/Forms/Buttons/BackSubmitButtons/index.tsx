import { useNavigate } from "@remix-run/react";
import { useEffect } from "react";

type Props = {
  loading?: boolean;
  setLoading?: Function;
  validationErrors?: string[];
};

const BackSubmitButtons = ({
  loading = false,
  setLoading,
  validationErrors,
}: Props) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (validationErrors && setLoading) {
      setLoading(false);
    }
  }, [validationErrors, setLoading]);

  return (
    <>
      <div className="divider w-full" />

      {validationErrors && validationErrors?.length > 0 && (
        <div className="pb-3">
          {validationErrors.map((error: string, i: number) => {
            return (
              <p
                key={error + i}
                className="my-2 text-center text-xs text-red-500"
              >
                {error}
              </p>
            );
          })}
        </div>
      )}

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
