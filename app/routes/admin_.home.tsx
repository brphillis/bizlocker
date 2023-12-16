import {
  type LoaderFunctionArgs,
  redirect,
  type MetaFunction,
} from "@remix-run/node";
import {
  IoCallOutline,
  IoDocumentTextOutline,
  IoGlobeOutline,
  IoPersonOutline,
} from "react-icons/io5";
import AdminPageWrapper from "~/components/Layout/_Admin/AdminPageWrapper";
import { useNavigate } from "@remix-run/react";
import PatternBackground from "~/components/Layout/PatternBackground";
import { getThemeColorValueByName } from "~/utility/colors";
import { tokenAuth } from "~/auth.server";
import { STAFF_SESSION_KEY } from "~/session.server";

export const meta: MetaFunction = () => [{ title: "CLUTCH - clothing." }];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const authenticated = await tokenAuth(request, STAFF_SESSION_KEY);

  if (!authenticated.valid) {
    return redirect("/admin/login");
  } else return null;
};

const Home = () => {
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
              <div
                className="flex h-28 w-28 cursor-pointer flex-col items-center justify-center gap-3 rounded-sm bg-primary p-3"
                onClick={() => navigate("/home")}
              >
                <IoGlobeOutline size={36} />
                <p className="font-semibold">Website</p>
              </div>

              <div className="flex h-28 w-28 cursor-pointer flex-col items-center justify-center gap-3 rounded-sm bg-primary p-3">
                <IoPersonOutline size={36} />
                <p className="font-semibold">Profile</p>
              </div>
            </div>

            <div className="flex flex-row gap-x-3">
              <div className="flex h-28 w-28 cursor-pointer flex-col items-center justify-center gap-3 rounded-sm bg-primary p-3">
                <IoDocumentTextOutline size={36} />
                <p className="font-semibold">Docs</p>
              </div>

              <div className="flex h-28 w-28 cursor-pointer flex-col items-center justify-center gap-3 rounded-sm bg-primary p-3">
                <IoCallOutline size={36} />
                <p className="font-semibold">Support</p>
              </div>
            </div>
          </div>

          <div className="divider !m-0 w-full !p-0 before:bg-brand-white/50 after:bg-brand-white/50" />

          <div className="select-none text-xs">Powered by BizLocker</div>
        </div>
      </div>
    </AdminPageWrapper>
  );
};

export default Home;
