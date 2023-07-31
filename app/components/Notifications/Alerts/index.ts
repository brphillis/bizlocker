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
    customClass: {
      popup: "bg-brand-black text-brand-white/75",
      title: "text-brand-white",
      confirmButton: "!bg-primary !rounded-none !shadow-none",
    },
  }).then(async (result) => {
    if (result.isConfirmed) {
      action();
    }
  });
};
