import type { FormEvent } from "react";

export const getFormData = (
  event: FormEvent<HTMLFormElement>
): HTMLFormElement => {
  const nativeEvent = event.nativeEvent as Event & {
    submitter?: HTMLButtonElement;
  };

  const form = event.target as HTMLFormElement;
  const actionInput = document.createElement("input");
  actionInput.type = "hidden";
  actionInput.name = "_action";
  actionInput.value = nativeEvent.submitter?.value || "";
  form.appendChild(actionInput);

  return form;
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
