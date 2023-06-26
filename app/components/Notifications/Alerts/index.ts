import Swal from "sweetalert2";
import { Toast } from "../Toast";

export const ConfirmationAlert = async (
  message: string,
  action: () => Promise<unknown>,
  callback: () => void
) => {
  Swal.fire({
    position: "center",
    icon: "warning",
    title: message,
    showConfirmButton: true,
    showCancelButton: true,
    confirmButtonText: "Confirm",
    customClass: {
      popup: "bg-base-300",
      title: "text-white",
    },
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await action();
        Toast("success", 3500);
        callback();
      } catch (error) {
        if (error && (error as Error).message) {
          Toast("error", 6500, (error as Error).message);
        } else {
          Toast("error", 6500, "An error occurred");
        }
      }
    }
  });
};
