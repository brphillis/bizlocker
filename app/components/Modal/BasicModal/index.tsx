import { IoClose } from "react-icons/io5";

type Props = {
  modalKey: string;
  title: string;
  button: JSX.Element | JSX.Element[];
  body: JSX.Element | JSX.Element[];
};

const BasicModal = ({ modalKey, title, button, body }: Props) => {
  return (
    <>
      <button
        className="relative cursor-pointer text-brand-white/50 hover:text-brand-white"
        onClick={() =>
          (document.getElementById(modalKey) as HTMLFormElement).showModal()
        }
      >
        {button}
      </button>

      <dialog id={modalKey} className="modal !rounded-sm !transition-none">
        <div className="scrollbar-hide modal-box max-h-[550px] !rounded-none border-b-[24px] border-b-brand-black bg-brand-black px-0 pt-0 max-md:!h-full max-md:!max-h-full max-md:!w-full">
          {/* HEADER */}
          <div className="sticky top-0 z-10 mx-auto flex h-[45px] w-full items-center justify-between bg-primary p-3 text-brand-white">
            <p className="select-none">{title}</p>

            <form method="dialog">
              <button type="submit" className="cursor-pointer">
                <IoClose />
              </button>
            </form>
          </div>

          {/* MODAL BODY */}
          {body}
        </div>
      </dialog>
    </>
  );
};

export default BasicModal;
