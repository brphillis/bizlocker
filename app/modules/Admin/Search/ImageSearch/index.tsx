import { json } from "@remix-run/node";
import type { Image } from "@prisma/client";
import Pagination from "~/components/Pagination";
import { searchImages } from "~/models/images.server";
import AdminContentSearch from "~/components/Search/AdminContentSearch";
import AdminPageHeader from "~/components/Layout/_Admin/AdminPageHeader";
import AdminPageWrapper from "~/components/Layout/Wrappers/AdminPageWrapper";
import {
  Form,
  Outlet,
  type Params,
  useLoaderData,
  useNavigate,
} from "@remix-run/react";

export const imageSearchLoader = async (
  request: Request,
  params: Params<string>
) => {
  const url = new URL(request.url);
  url.searchParams.set("perPage", "12");

  const { images, totalPages } = await searchImages(undefined, url);

  return json({ images, totalPages });
};

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
              <img
                key={id}
                src={href ?? ""}
                alt={altText ?? "placeholder"}
                className=" h-52 w-52 cursor-pointer object-cover transition-all duration-300 hover:scale-105 max-lg:h-44 max-lg:w-44"
                onClick={() => navigate(`/admin/upsert/image?contentId=${id}`)}
              />
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
