import type { LoaderArgs } from "@remix-run/node";
import { Form, Outlet, useLoaderData, useNavigate } from "@remix-run/react";
import AdminPageHeader from "~/components/Layout/_Admin/AdminPageHeader";
import AdminPageWrapper from "~/components/Layout/_Admin/AdminPageWrapper";
import Pagination from "~/components/Pagination";
import { searchImages } from "~/models/images.server";

export const loader = async ({ request }: LoaderArgs) => {
  const url = new URL(request.url);
  url.searchParams.set("perPage", "12");
  const { images, totalPages } = await searchImages(undefined, url);

  return { images, totalPages };
};

const Images = () => {
  const navigate = useNavigate();
  const { images, totalPages } = useLoaderData() || {};

  return (
    <AdminPageWrapper>
      <Form method="GET" className="relative h-full w-full bg-base-200 p-6">
        <AdminPageHeader title="Manage Images" addButtonText="Add Image" />

        <div className="mt-6 flex flex-col">
          <div className="flex flex-row flex-wrap gap-6">
            <div className="flex w-full flex-row gap-6 sm:w-[215px]">
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Search Alt Text</span>
                </label>
                <input
                  name="title"
                  className="input w-full text-brand-black/50"
                  placeholder="Search Alt Text"
                  type="text"
                />
              </div>
            </div>

            <div className="form-control w-full sm:w-[215px]">
              <label className="label text-sm">Search Connection</label>
              <select
                name="connectionType"
                className="select w-full text-brand-black/50"
              >
                <option value="">Select a Connection</option>
                <option value="promotion">Promotion</option>
                <option value="campaign">Campaign</option>
                <option value="brand">Brand</option>
                <option value="product">Product</option>
                <option value="article">Article</option>
                <option value="disconnected">Disconnected</option>
              </select>
            </div>
          </div>

          <div className="flex flex-row justify-end sm:justify-start">
            <button type="submit" className="btn btn-primary mt-6 w-max">
              Search
            </button>
          </div>
        </div>

        <div className="divider w-full" />

        <div className="flex w-full flex-wrap justify-center gap-6 overflow-x-auto pb-3 max-lg:gap-3">
          {images?.map(({ id, url, altText }: Image, i: number) => {
            return (
              <img
                key={id}
                src={url}
                alt={altText}
                className=" h-52 w-52 cursor-pointer object-cover transition-all duration-300 hover:scale-105 max-lg:h-44 max-lg:w-44"
                onClick={() => navigate(`/admin/images/${id}`)}
              />
            );
          })}
        </div>

        <Pagination totalPages={totalPages} />
      </Form>
      <Outlet />
    </AdminPageWrapper>
  );
};

export default Images;
