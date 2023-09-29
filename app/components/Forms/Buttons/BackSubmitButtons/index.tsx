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
};

const BackSubmitButtons = ({
  loading = false,
  setLoading,
  value = "upsert",
  divider = true,
  requiredValueToSubmit = true,
  validationMessage,
  backFunction,
}: Props) => {
  const navigate = useNavigate();
  const [validationErrors, setValidationErrors] = useState<string[]>();

  const checkValidation = () => {
    if (!requiredValueToSubmit && validationMessage) {
      setValidationErrors([validationMessage]);
    }
  };

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
          type={requiredValueToSubmit ? "submit" : "button"}
          name="_action"
          value={value}
          className="btn btn-primary w-max !rounded-sm"
          onClick={() => {
            checkValidation();
            setLoading && requiredValueToSubmit && setLoading(true);
          }}
        >
          {loading ? "Loading..." : "Submit"}
        </button>
      </div>
    </>
  );
};

export default BackSubmitButtons;
