import type { FormEvent } from "react";
import { ActionAlert } from "~/components/Notifications/Alerts";

export const handleResourceSubmit = (
  e: FormEvent<HTMLFormElement>,
  submit: (any: any) => any,
  hasConnections?: boolean
) => {
  const nativeEvent = e.nativeEvent as Event & {
    submitter?: HTMLButtonElement;
  };
  if (nativeEvent.submitter) {
    const submitterValue = nativeEvent.submitter.value;
    const form = e.target as HTMLFormElement;
    const actionInput = document.createElement("input");
    actionInput.type = "hidden";
    actionInput.name = "_action";

    if (submitterValue === "delete") {
      e.preventDefault();

      ActionAlert(
        "Confirmation",
        "Are you sure you want to delete this resource?",
        () => {
          actionInput.value = "delete";
          form.appendChild(actionInput);

          if (hasConnections) {
            ActionAlert(
              "Warning",
              "This resource is connected to other resources, also disconnect all connections?",
              () => submit(form)
            );
          } else {
            submit(form);
          }
        }
      );
    }

    if (submitterValue === "upsert") {
      e.preventDefault();

      ActionAlert("Confirmation", "Update this resource?", () => {
        actionInput.value = "upsert";
        form.appendChild(actionInput);
        submit(form);
      });
    }
  }
};

export const findFirstNotNullInputValue = (inputName: string) => {
  const res = Array.from(
    document.querySelectorAll(`input[name=${inputName}]`)
  ).find(
    (input) =>
      input instanceof HTMLInputElement && input.type === "text" && input.value
  ) as HTMLInputElement;
  return res;
};
