import ToolTip from "~/components/Indicators/ToolTip";
import type { ValidationErrors } from "~/utility/validate";

type Props = {
  formName: string;
  clientValidationErrors: ValidationErrors | undefined;
  serverValidationErrors: ValidationErrors;
  extendStyle?: string;
};

const TabValidationErrors = ({
  formName,
  clientValidationErrors,
  serverValidationErrors,
  extendStyle,
}: Props) => {
  return (
    <>
      {(clientValidationErrors?.hasOwnProperty(formName) && (
        <ToolTip
          tip={clientValidationErrors[formName]}
          iconColor="text-error"
          extendStyle={`!top-0 !right-0 ${extendStyle}`}
          direction="left"
        />
      )) ||
        (serverValidationErrors?.hasOwnProperty(formName) && (
          <ToolTip
            tip={serverValidationErrors[formName]}
            iconColor="text-error"
            extendStyle={`!top-0 !right-0 ${extendStyle}`}
            direction="left"
          />
        ))}
    </>
  );
};

export default TabValidationErrors;
