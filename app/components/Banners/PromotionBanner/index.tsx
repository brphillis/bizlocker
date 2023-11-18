import {
  useLocation,
  useNavigate,
  useSearchParams,
  useSubmit,
} from "@remix-run/react";

type Props = {
  promotion: Promotion;
};

const PromotionBanner = ({ promotion }: Props) => {
  const [searchParams] = useSearchParams();
  const { pathname } = useLocation();
  const submit = useSubmit();
  const navigate = useNavigate();

  const { name, bannerImage, targetGender } = promotion;

  return (
    <div className="max-w-full max-md:-mt-3 sm:w-[1280px]">
      <img
        src={bannerImage?.href}
        alt={name + "_bannerImage"}
        className="h-[146px] w-full max-w-[100vw] object-cover max-xl:h-[124px] max-lg:h-[100px] max-md:h-[88px]"
      />
      {targetGender && (
        <div className="flex w-full justify-center gap-3 bg-base-200/50 py-1 text-brand-black">
          <button
            className="sm:text-md px-6 py-2 text-sm font-semibold tracking-wide hover:bg-primary-content/10"
            onClick={() => navigate(pathname)}
          >
            All
          </button>
          <button
            className="sm:text-md px-6 py-2 text-sm font-semibold tracking-wide hover:bg-primary-content/10"
            onClick={() => {
              searchParams.set("gender", "MALE");
              submit(searchParams, {
                method: "GET",
                action: pathname,
              });
            }}
          >
            Mens
          </button>
          <button
            className="sm:text-md px-6 py-2 text-sm font-semibold tracking-wide hover:bg-primary-content/10"
            onClick={() => {
              searchParams.set("gender", "FEMALE");
              submit(searchParams, {
                method: "GET",
                action: pathname,
              });
            }}
          >
            Womans
          </button>
          <button
            className="sm:text-md px-6 py-2 text-sm font-semibold tracking-wide hover:bg-primary-content/10"
            onClick={() => {
              searchParams.set("gender", "KIDS");
              submit(searchParams, {
                method: "GET",
                action: pathname,
              });
            }}
          >
            Kids
          </button>
        </div>
      )}
    </div>
  );
};

export default PromotionBanner;
