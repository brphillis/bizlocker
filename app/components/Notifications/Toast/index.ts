import Swal from "sweetalert2";
import { capitalizeFirst } from "../../../utility/stringHelpers";

type ToastType = "success" | "error" | "warning" | "info" | "question";

export const Toast = (type: ToastType, time?: number, text?: string) => {
  let color: string;

  switch (type) {
    case "success":
      color = "!bg-[#06ba63]";
      break;

    case "error":
      color = "!bg-[#f27474]";
      break;

    case "warning":
      color = "!bg-[#f8bb86]";
      break;

    case "info":
      color = "!bg-[#3fc3ee]";
      break;

    case "question":
      color = "!bg-[#87adbd]";
      break;

    default:
      color = "bg-base-300";
  }

  return Swal.fire({
    toast: true,
    position: "bottom-right",
    iconColor: "white",
    title: capitalizeFirst(type) + `${text ? " - " + text : ""}`,
    icon: type,
    customClass: {
      popup: color,
      title: "text-white bold",
    },
    showConfirmButton: false,
    timer: time || 2500,
    timerProgressBar: true,
  });
};
