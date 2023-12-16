import Swal from "sweetalert2";

export type ActionAlertType =
  | "success"
  | "error"
  | "warning"
  | "info"
  | "question";

export const ActionAlert = async (
  title: string,
  text: string,
  action: () => void,
  type?: ActionAlertType
) => {
  Swal.fire({
    position: "center",
    icon: type ? type : "success",
    title: title,
    text: text,
    showConfirmButton: true,
    confirmButtonText: "Confirm",
    showCancelButton: true,
    cancelButtonText: "Cancel",
    reverseButtons: true,
    customClass: {
      popup: "bg-brand-black text-brand-white/75",
      title: "text-brand-white",
      confirmButton: "!bg-primary !rounded-sm !shadow-none",
      cancelButton: "!bg-red-400 !rounded-sm !shadow-none",
    },
  }).then(async (result) => {
    if (result.isConfirmed) {
      action();
    }
  });
};
