import { useNavigate } from "@remix-run/react";
import { useState } from "react";

type Props = {
  loading?: boolean;
  setLoading?: Function;
  value?: string;
  divider?: boolean;
  backFunction?: () => void;
  requiredValueToSubmit?: boolean;
  validationMessage?: string;
  hideSubmit?: boolean;
  validationErrors?: ValidationErrors;
};

const BackSubmitButtons = ({
  loading = false,
  setLoading,
  value = "upsert",
  divider = true,
  requiredValueToSubmit = true,
  validationMessage,
  backFunction,
  hideSubmit,
  validationErrors,
}: Props) => {
  const navigate = useNavigate();
  const [error, setError] = useState<string[]>();

  const checkValidation = () => {
    if (!requiredValueToSubmit && validationMessage) {
      setError([validationMessage]);
    }
  };

  return (
    <>
      {divider && <div className="divider w-full" />}

      {error && error?.length > 0 && (
        <div className="pb-3">
          {error.map((error: string, i: number) => {
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
          onClick={() => (backFunction ? backFunction() : navigate(-1))}
        >
          Back
        </button>
        {!hideSubmit && (
          <button
            type={requiredValueToSubmit ? "submit" : "button"}
            name="_action"
            value={value}
            className="btn btn-primary w-max !rounded-sm"
            onClick={() => {
              checkValidation();
              setLoading && requiredValueToSubmit && setLoading(true);
            }}
          >
            {loading && !validationErrors ? "Loading..." : "Submit"}
          </button>
        )}
      </div>
    </>
  );
};

export default BackSubmitButtons;
