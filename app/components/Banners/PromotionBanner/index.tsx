import type { Image, Gender } from "@prisma/client";
import {
  useLocation,
  useNavigate,
  useSearchParams,
  useSubmit,
} from "@remix-run/react";
import BasicImage from "~/components/Client/BasicImage";

type Props = {
  name: string;
  bannerImage: Image;
  targetGender: Gender | null;
};

const PromotionBanner = ({ name, bannerImage, targetGender }: Props) => {
  const [searchParams] = useSearchParams();
  const { pathname } = useLocation();
  const submit = useSubmit();
  const navigate = useNavigate();

  return (
    <>
      {bannerImage?.href && (
        <div className="max-w-full max-md:-mt-3 w-[1280px]">
          <BasicImage
            extendStyle="h-[146px] w-full max-w-[100vw] object-cover max-xl:h-[124px] max-lg:h-[100px] max-md:h-[88px]"
            link={`/promotion/${name}`}
            src={bannerImage.href}
            alt={name + "_bannerImage"}
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
                className="sm:text-md px-6 py-2 text-sm font-semibold tracking-wide hover:bg-base-200"
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
                className="sm:text-md px-6 py-2 text-sm font-semibold tracking-wide hover:bg-base-200"
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
                className="sm:text-md px-6 py-2 text-sm font-semibold tracking-wide hover:bg-base-200"
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
      )}
    </>
  );
};

export default PromotionBanner;
