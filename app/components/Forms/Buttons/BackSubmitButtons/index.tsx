import { useNavigate } from "@remix-run/react";
import { useEffect } from "react";

type Props = {
  loading?: boolean;
  setLoading?: Function;
  validationErrors?: string[];
  value?: string;
  divider?: boolean;
  backFunction?: () => void;
};

const BackSubmitButtons = ({
  loading = false,
  setLoading,
  validationErrors,
  value = "upsert",
  divider = true,
  backFunction,
}: Props) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (validationErrors && setLoading) {
      setLoading(false);
    }
  }, [validationErrors, setLoading]);

  return (
    <>
      {divider && <div className="divider w-full" />}

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
          className="btn btn-primary w-max !rounded-sm"
          onClick={() => (backFunction ? backFunction() : navigate(".."))}
        >
          Back
        </button>
        <button
          type="submit"
          name="_action"
          value={value}
          className="btn btn-primary w-max !rounded-sm"
          onClick={() => setLoading && setLoading(true)}
        >
          {loading ? "Loading..." : "Submit"}
        </button>
      </div>
    </>
  );
};

export default BackSubmitButtons;
