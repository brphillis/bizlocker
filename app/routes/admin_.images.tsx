import type { LoaderArgs } from "@remix-run/node";
import { Form, useLoaderData, useNavigate } from "@remix-run/react";
import AdminPageHeader from "~/components/Layout/AdminPageHeader";
import AdminPageWrapper from "~/components/Layout/AdminPageWrapper";
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
                <option value="promotion">promotion</option>
                <option value="campaign">campaign</option>
                <option value="brand">brand</option>
                <option value="product">product</option>
                <option value="article">article</option>
                <option value="disconnected">disconnected</option>
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

        <div className="mb-3 flex w-full max-w-[80vw] flex-wrap justify-center gap-6 overflow-x-auto">
          {images?.map(({ id, url, altText }: Image, i: number) => {
            return (
              <img
                key={id}
                src={url}
                alt={altText}
                className="h-52 w-52 cursor-pointer object-cover"
                onClick={() => navigate(`/admin/images/${id}`)}
              />
            );
          })}
        </div>

        <Pagination totalPages={totalPages} />
      </Form>
    </AdminPageWrapper>
  );
};

export default Images;
