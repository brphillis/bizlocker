import type { ValidationErrors } from "~/utility/validate";

type Props = {
  validationErrors: ValidationErrors;
  extendStyle?: string;
};

const ValidationErrorsDisplay = ({ validationErrors, extendStyle }: Props) => {
  return (
    <div className={`${extendStyle}`}>
      {validationErrors &&
        Object.values(validationErrors)?.map((error: string, i) => (
          <p key={error + i} className="my-2 text-center text-xs text-red-500">
            {error}
          </p>
        ))}
    </div>
  );
};

export default ValidationErrorsDisplay;
