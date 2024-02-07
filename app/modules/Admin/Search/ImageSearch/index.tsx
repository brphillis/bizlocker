import type { Image } from "@prisma/client";
import Pagination from "~/components/Pagination";
import AdminContentSearch from "~/components/Search/AdminContentSearch";
import AdminPageHeader from "~/components/Layout/_Admin/AdminPageHeader";
import AdminPageWrapper from "~/components/Layout/Wrappers/AdminPageWrapper";
import { Form, Outlet, useLoaderData, useNavigate } from "@remix-run/react";
import type { imageSearchLoader } from "./index.server";
import { getBucketImageSrc } from "~/integrations/_master/storage";

const ImageSearch = () => {
  const { images, totalPages } = useLoaderData<typeof imageSearchLoader>();

  const navigate = useNavigate();

  return (
    <AdminPageWrapper>
      <div className="relative h-full w-full bg-base-200 p-6">
        <AdminPageHeader
          title="Manage Images"
          buttonLabel="Add Image"
          buttonLink="/admin/upsert/image?contentId=add"
        />

        <Form method="GET">
          <AdminContentSearch title={true} imageConnection={true} />
        </Form>

        <div className="divider w-full" />

        <div className="flex w-full flex-wrap justify-center gap-6 overflow-x-auto py-3 max-lg:gap-3">
          {images?.map(({ id, href, altText }: Image) => {
            return (
              <div
                role="button"
                key={id}
                tabIndex={0}
                className="h-52 w-52 cursor-pointer hover:scale-105 max-lg:h-44 max-lg:w-44 transition-all duration-300"
                onClick={() => navigate(`/admin/upsert/image?contentId=${id}`)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    navigate(`/admin/upsert/image?contentId=${id}`);
                  }
                }}
              >
                <img
                  src={(href && getBucketImageSrc(href)) ?? ""}
                  alt={altText ?? "placeholder"}
                  className="w-full h-full object-cover"
                />
              </div>
            );
          })}
        </div>

        <Pagination totalPages={totalPages} />
      </div>
      <Outlet />
    </AdminPageWrapper>
  );
};

export default ImageSearch;
