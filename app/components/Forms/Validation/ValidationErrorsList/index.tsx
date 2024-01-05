import type { ValidationErrors } from "~/utility/validate";

type Props = {
  validationErrors: ValidationErrors;
  extendStyle?: string;
};

const ValidationErrorsList = ({ validationErrors, extendStyle }: Props) => {
  return (
    <div className={extendStyle}>
      {validationErrors &&
        Object.values(validationErrors)?.map((error: string, i) => (
          <p
            key={error + i}
            className="mt-1 text-center text-xs text-red-500/75"
          >
            {error}
          </p>
        ))}
    </div>
  );
};

export default ValidationErrorsList;
