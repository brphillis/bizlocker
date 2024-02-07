import {
  IoCallOutline,
  IoDocumentTextOutline,
  IoGlobeOutline,
  IoPersonOutline,
} from "react-icons/io5";
import AdminPageWrapper from "~/components/Layout/Wrappers/AdminPageWrapper";
import { useNavigate } from "@remix-run/react";
import PatternBackground from "~/components/Layout/Backgrounds/PatternBackground";
import { getThemeColorValueByName } from "~/utility/colors";

const AdminHome = () => {
  const navigate = useNavigate();

  return (
    <AdminPageWrapper>
      <div className="relative flex h-full w-full items-center justify-center bg-base-200 p-6">
        <PatternBackground
          name="isometric"
          backgroundColor={getThemeColorValueByName("brand-black")}
          patternColor={getThemeColorValueByName("brand-white")}
          patternOpacity={0.2}
          patternSize={140}
          brightness={-1.5}
        />
        <div className="relative mb-[20vh] flex w-[520px] max-w-full flex-col items-center gap-3 rounded-sm border-t-4 border-primary bg-brand-black px-3 py-6 text-brand-white">
          <div className="flex select-none flex-col items-center py-3 text-center">
            <div className="text-4xl font-bold tracking-widest text-brand-white">
              CLUTCH.
            </div>
            <div className="text-xs">administration portal</div>
          </div>

          <div className="divider !m-0 w-full !p-0 before:bg-brand-white/50 after:bg-brand-white/50" />

          <div className="flex flex-row flex-wrap items-center justify-center gap-3">
            <div className="flex flex-row gap-x-3">
              <button
                className="flex h-28 w-28 cursor-pointer flex-col items-center justify-center gap-3 rounded-sm bg-primary p-3"
                onClick={() => navigate("/")}
                type="button"
              >
                <IoGlobeOutline size={36} />
                <p className="font-semibold">Website</p>
              </button>

              <button
                className="flex h-28 w-28 cursor-pointer flex-col items-center justify-center gap-3 rounded-sm bg-primary p-3"
                onClick={() => navigate("/")}
                type="button"
              >
                <IoPersonOutline size={36} />
                <p className="font-semibold">Profile</p>
              </button>
            </div>

            <div className="flex flex-row gap-x-3">
              <button
                className="flex h-28 w-28 cursor-pointer flex-col items-center justify-center gap-3 rounded-sm bg-primary p-3"
                onClick={() => navigate("/")}
                type="button"
              >
                <IoDocumentTextOutline size={36} />
                <p className="font-semibold">Docs</p>
              </button>

              <button
                className="flex h-28 w-28 cursor-pointer flex-col items-center justify-center gap-3 rounded-sm bg-primary p-3"
                onClick={() => navigate("/")}
                type="button"
              >
                <IoCallOutline size={36} />
                <p className="font-semibold">Support</p>
              </button>
            </div>
          </div>

          <div className="divider !m-0 w-full !p-0 before:bg-brand-white/50 after:bg-brand-white/50" />

          <div className="select-none text-xs">Powered by BizLocker</div>
        </div>
      </div>
    </AdminPageWrapper>
  );
};

export default AdminHome;
