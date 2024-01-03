import type { NotificationWithContent } from "~/models/notifications";
import { formatDate } from "~/helpers/dateHelpers";
import parse from "html-react-parser";
import { parseOptions } from "~/utility/parseOptions";
import { IoClose, IoPerson, IoStorefront } from "react-icons/io5";

type Props = {
  notification: NotificationWithContent;
};

const NotificationCard = ({ notification }: Props) => {
  const { storeId, staffId, createdAt, message } = notification;

  return (
    <div
      className={`relative flex w-full cursor-pointer items-start justify-between gap-3 rounded-sm p-3 pt-1 transition-all duration-300 hover:scale-[1.02]
     ${storeId ? "bg-brand-red" : "bg-primary"}`}
    >
      <div className="cursor-pointer pt-3 text-brand-white">
        {storeId && <IoStorefront size={20} />}
        {staffId && <IoPerson size={20} />}
      </div>

      <div>
        <p className="w-full pb-2 pt-2 text-left text-[10px]">
          {createdAt && formatDate(new Date(createdAt), true)}
        </p>
        <p className="w-full pb-3 pt-3 text-center">
          {parse(message, parseOptions)}
        </p>
      </div>

      <div className="cursor-pointer pt-3 text-brand-white">
        {!storeId && <IoClose size={16} />}
        {storeId && <div className="w-[15px]" />}
      </div>
    </div>
  );
};

export default NotificationCard;
