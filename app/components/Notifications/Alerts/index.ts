import Swal from "sweetalert2";

export const ActionAlert = async (
  title: string,
  text: string,
  action: () => void
) => {
  Swal.fire({
    position: "center",
    icon: "success",
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
      confirmButton: "!bg-green-400 !rounded-none !shadow-none",
      cancelButton: "!bg-red-400 !rounded-none !shadow-none",
    },
  }).then(async (result) => {
    if (result.isConfirmed) {
      action();
    }
  });
};
