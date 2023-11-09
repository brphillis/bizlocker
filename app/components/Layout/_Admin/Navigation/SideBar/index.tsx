import {
  Outlet,
  useLocation,
  useNavigate,
  useNavigation,
  useSubmit,
} from "@remix-run/react";
import {
  IoBriefcase,
  IoFileTrayFull,
  IoFolder,
  IoHomeSharp,
  IoLocation,
  IoMegaphone,
  IoMenu,
  IoNotificationsOutline,
  IoPeople,
  IoPlanet,
  IoPricetag,
  IoSettingsOutline,
} from "react-icons/io5";
import DarkOverlay from "~/components/Layout/DarkOverlay";
import Spinner from "~/components/Spinner";

type Props = {
  user: User;
};

const AdminSideBar = ({ user }: Props) => {
  const navigate = useNavigate();
  const navigation = useNavigation();
  const location = useLocation();
  const submit = useSubmit();

  const LogoutButton = (style?: string) => {
    return (
      <button
        className={"btn-primary btn-md !rounded-sm " + style}
        onClick={() => submit(null, { method: "post", action: "/logout" })}
      >
        Log Out
      </button>
    );
  };

  return (
    <div
      data-theme="light-theme"
      className="drawer min-h-screen lg:drawer-open"
    >
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content relative flex min-h-[calc(100vh-60px)] flex-col items-center justify-start overflow-x-hidden">
        <div className="flex h-[60px] w-full flex-row items-center gap-6 self-start justify-self-start bg-brand-black p-3 lg:hidden">
          <label
            htmlFor="my-drawer-2"
            className="btn btn-square btn-ghost text-brand-white/50"
          >
            <IoMenu size={26} />
          </label>
          <h1
            className="select-none text-center text-2xl font-bold tracking-wide text-white/90"
            onClick={() => navigate("/admin/home")}
          >
            CLUTCH.
          </h1>
        </div>

        {location.state === ("loading" || "submitting") && (
          <DarkOverlay fadeIn={true}>
            <div>LOADING...</div>
          </DarkOverlay>
        )}

        {navigation.state === ("loading" || "submitting") && (
          <DarkOverlay>
            <Spinner mode="circle" extendStyle={"mt-16"} />
          </DarkOverlay>
        )}

        <Outlet />
      </div>

      {user && (
        <div className="drawer-side z-50 min-h-screen">
          <label
            htmlFor="my-drawer-2"
            className="drawer-overlay !min-h-screen"
          ></label>
          <ul className="scrollbar-hide menu h-max min-h-full w-80 overflow-y-scroll bg-brand-black px-0 py-4 text-brand-white">
            <h1 className="select-none pt-3 text-center text-2xl font-bold tracking-wide text-white/90">
              CLUTCH.
            </h1>
            <p className="pt-3 text-center text-[12px]">
              Welcome, {user?.email}
            </p>
            <div className="divider w-full" />

            <div className="scrollbar-hide max-h-[calc(100vh-212px)] overflow-y-auto">
              <div
                onClick={() => navigate("/admin/home")}
                className="flex h-[60px] w-full cursor-pointer items-center gap-3 pl-4"
              >
                <IoHomeSharp size={18} />
                <p className="select-none transition duration-500 ease-in-out hover:scale-[1.03]">
                  Home
                </p>
              </div>

              <details className="collapse collapse-arrow relative rounded-none border border-x-0 border-brand-white/10 bg-brand-white/5  pb-1 open:pb-0">
                <summary className="text-md collapse-title -mb-3 font-medium tracking-wide text-primary-content after:mt-[-4px] after:text-brand-white">
                  <div className="flex items-center gap-3">
                    <IoBriefcase size={18} />
                    <p className="select-none transition duration-500 ease-in-out hover:scale-[1.03]">
                      My WorkPlace
                    </p>
                  </div>
                </summary>

                <div className="collapse-content">
                  <ul className="!px-3 !pt-1 text-white/75">
                    <li onClick={() => navigate("/admin/staff")}>
                      <label htmlFor="my-drawer-2" className="hover:text-white">
                        Staff
                      </label>
                    </li>
                    <li onClick={() => navigate("/admin/teams")}>
                      <label htmlFor="my-drawer-2" className="hover:text-white">
                        Teams
                      </label>
                    </li>
                    <li onClick={() => navigate("/admin/orders")}>
                      <label htmlFor="my-drawer-2" className="hover:text-white">
                        Orders
                      </label>
                    </li>
                  </ul>
                </div>
              </details>

              <details className="collapse collapse-arrow relative rounded-none border border-x-0 border-t-0 border-brand-white/10 bg-brand-white/5 pb-1 open:pb-0">
                <summary className="text-md collapse-title -mb-3 font-medium tracking-wide text-primary-content after:mt-[-4px] after:text-brand-white">
                  <div className="flex items-center gap-3">
                    <IoPlanet size={18} />
                    <p className="transition duration-500 ease-in-out hover:scale-[1.03]">
                      Website
                    </p>
                  </div>
                </summary>
                <div className="collapse-content">
                  <ul className="!px-3 !pt-1 text-white/75">
                    <li onClick={() => navigate("/admin/pagebuilder/homepage")}>
                      <label htmlFor="my-drawer-2" className="hover:text-white">
                        Home Page
                      </label>
                    </li>
                    <li onClick={() => navigate("/admin/pages")}>
                      <label htmlFor="my-drawer-2" className="hover:text-white">
                        Pages
                      </label>
                    </li>
                    <li onClick={() => navigate("/admin/articles")}>
                      <label htmlFor="my-drawer-2" className="hover:text-white">
                        Articles
                      </label>
                    </li>
                    <li onClick={() => navigate("/admin/article-categories")}>
                      <label htmlFor="my-drawer-2" className="hover:text-white">
                        Article Categories
                      </label>
                    </li>
                  </ul>
                </div>
              </details>

              <details className="collapse collapse-arrow relative rounded-none border border-x-0  border-t-0 border-brand-white/10 bg-brand-white/5 pb-1 open:pb-0">
                <summary className="text-md collapse-title -mb-3 font-medium tracking-wide text-primary-content after:mt-[-4px] after:text-brand-white">
                  <div className="flex items-center gap-3">
                    <IoPeople size={18} />
                    <p className="select-none transition duration-500 ease-in-out hover:scale-[1.03]">
                      User Management
                    </p>
                  </div>
                </summary>

                <div className="collapse-content">
                  <ul className="!px-3 !pt-1 text-white/75">
                    <li onClick={() => navigate("/admin/users")}>
                      <label htmlFor="my-drawer-2" className="hover:text-white">
                        Users
                      </label>
                    </li>
                  </ul>
                </div>
              </details>

              <details className="collapse collapse-arrow relative rounded-none border border-x-0 border-t-0 border-brand-white/10 bg-brand-white/5 pb-1 open:pb-0">
                <summary className="text-md collapse-title -mb-3 font-medium tracking-wide text-primary-content after:mt-[-4px] after:text-brand-white">
                  <div className="flex items-center gap-3">
                    <IoLocation size={18} />
                    <p className="select-none transition duration-500 ease-in-out hover:scale-[1.03]">
                      Locations
                    </p>
                  </div>
                </summary>

                <div className="collapse-content">
                  <ul className="!px-3 !pt-1 text-white/75">
                    <li onClick={() => navigate("/admin/stores")}>
                      <label htmlFor="my-drawer-2" className="hover:text-white">
                        Stores
                      </label>
                    </li>
                  </ul>
                </div>
              </details>

              <details className="collapse collapse-arrow relative rounded-none border border-x-0 border-t-0 border-brand-white/10 bg-brand-white/5  pb-1 open:pb-0">
                <summary className="text-md collapse-title -mb-3 font-medium tracking-wide text-primary-content after:mt-[-4px] after:text-brand-white">
                  <div className="flex items-center gap-3">
                    <IoPricetag size={18} />
                    <p className="transition duration-500 ease-in-out hover:scale-[1.03]">
                      Product
                    </p>
                  </div>
                </summary>
                <div className="collapse-content">
                  <ul className="!px-3 !pt-1 text-white/75">
                    <li onClick={() => navigate("/admin/products")}>
                      <label htmlFor="my-drawer-2" className="hover:text-white">
                        Products
                      </label>
                    </li>
                    <li onClick={() => navigate("/admin/departments")}>
                      <label htmlFor="my-drawer-2" className="hover:text-white">
                        Departments
                      </label>
                    </li>
                    <li onClick={() => navigate("/admin/product-categories")}>
                      <label htmlFor="my-drawer-2" className="hover:text-white">
                        Categories
                      </label>
                    </li>
                    <li
                      onClick={() => navigate("/admin/product-subcategories")}
                    >
                      <label htmlFor="my-drawer-2" className="hover:text-white">
                        SubCategories
                      </label>
                    </li>
                    <li onClick={() => navigate("/admin/brands")}>
                      <label htmlFor="my-drawer-2" className="hover:text-white">
                        Brands
                      </label>
                    </li>
                    <li onClick={() => navigate("/admin/stock-transfers")}>
                      <label htmlFor="my-drawer-2" className="hover:text-white">
                        Stock Transfers
                      </label>
                    </li>
                  </ul>
                </div>
              </details>

              <details className="collapse collapse-arrow relative rounded-none border border-x-0 border-t-0 border-brand-white/10 bg-brand-white/5  pb-1 open:pb-0">
                <summary className="text-md collapse-title -mb-3 font-medium tracking-wide text-primary-content after:mt-[-4px] after:text-brand-white">
                  <div className="flex items-center gap-3">
                    <IoFolder size={18} />
                    <p className="transition duration-500 ease-in-out hover:scale-[1.03]">
                      Storage
                    </p>
                  </div>
                </summary>
                <div className="collapse-content">
                  <ul className="!px-3 !pt-1 text-white/75">
                    <li onClick={() => navigate("/admin/images")}>
                      <label htmlFor="my-drawer-2" className="hover:text-white">
                        Images
                      </label>
                    </li>
                  </ul>
                </div>
              </details>

              <details className="collapse collapse-arrow relative rounded-none border border-x-0 border-t-0 border-brand-white/10 bg-brand-white/5  pb-1 open:pb-0">
                <summary className="text-md collapse-title -mb-3 font-medium tracking-wide text-primary-content after:mt-[-4px] after:text-brand-white">
                  <div className="flex items-center gap-3">
                    <IoFileTrayFull size={18} />
                    <p className="transition duration-500 ease-in-out hover:scale-[1.03]">
                      Reports
                    </p>
                  </div>
                </summary>
                <div className="collapse-content">
                  <ul className="!px-3 !pt-1 text-white/75">
                    <li onClick={() => navigate("/admin/report-sales")}>
                      <label htmlFor="my-drawer-2" className="hover:text-white">
                        Sales
                      </label>
                    </li>
                  </ul>
                </div>
              </details>

              <details className="collapse collapse-arrow relative rounded-none border border-x-0 border-t-0 border-brand-white/10 bg-brand-white/5  pb-1 open:pb-0">
                <summary className="text-md collapse-title -mb-3 font-medium tracking-wide text-primary-content after:mt-[-4px] after:text-brand-white">
                  <div className="flex items-center gap-3">
                    <IoMegaphone size={18} />
                    <p className="transition duration-500 ease-in-out hover:scale-[1.03]">
                      Marketing
                    </p>
                  </div>
                </summary>
                <div className="collapse-content">
                  <ul className="!px-3 !pt-1 text-white/75">
                    <li onClick={() => navigate("/admin/promotions")}>
                      <label htmlFor="my-drawer-2" className="hover:text-white">
                        Promotions
                      </label>
                    </li>
                    <li onClick={() => navigate("/admin/campaigns")}>
                      <label htmlFor="my-drawer-2" className="hover:text-white">
                        Campaigns
                      </label>
                    </li>
                  </ul>
                </div>
              </details>
            </div>

            <div className="border-t-1 absolute bottom-0 flex w-full items-center justify-between border-t border-t-brand-white/10 bg-brand-white/5 p-3">
              <div className="flex items-center gap-3">
                <div className="cursor-pointer text-brand-white/50 hover:text-brand-white">
                  <IoSettingsOutline size={22} />
                </div>

                <div className="cursor-pointer text-brand-white/50 hover:text-brand-white">
                  <IoNotificationsOutline size={22} />
                </div>
              </div>
              <div>{user && <>{LogoutButton()}</>}</div>
            </div>
          </ul>
        </div>
      )}
    </div>
  );
};

export default AdminSideBar;
