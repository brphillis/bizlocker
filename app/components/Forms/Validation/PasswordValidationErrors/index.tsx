import type { ValidationErrors } from "~/utility/validate";

type Props = {
  validationErrors: ValidationErrors;
  extendStyle?: string;
};

const PasswordValidationErrors = ({ validationErrors, extendStyle }: Props) => {
  return (
    <div className={extendStyle}>
      {validationErrors &&
        Object.values(validationErrors)?.includes(
          "Password" && "Requirements"
        ) && (
          <div className="flex flex-col items-start text-[10px] text-red-500/75">
            <div>- At least one uppercase letter (A-Z) </div>
            <div>- At least one lowercase letter (a-z) </div>
            <div>
              - At least one digit (0-9) - At least one special character
              (!@#$%^&*)
            </div>
            <div>- At least 8 characters long, but no more than 32</div>
          </div>
        )}
    </div>
  );
};

export default PasswordValidationErrors;
