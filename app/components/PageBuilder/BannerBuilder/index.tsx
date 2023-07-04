import { Form, useSearchParams, useSubmit } from "@remix-run/react";
import React, { useState } from "react";
import { IoCaretForwardCircleSharp } from "react-icons/io5";
import SearchInput from "~/components/Forms/Input/SearchInput";
import { getBlockContent, getBlockContentType } from "~/utility/blockHelpers";
import { capitalizeFirst } from "~/utility/stringHelpers";

type Props = {
  homePage: Page;
  searchResults: Campaign[] | Promotion[];
};

const HomePageBannerBuilder = ({ homePage, searchResults }: Props) => {
  const [searchParams] = useSearchParams();
  const submit = useSubmit();

  const { pageItems } = homePage || {};

  //return the page item that has an order of 0, 0 is the banner for the homepage Always
  const banner =
    getBlockContent(pageItems?.find((e) => e.order === 0) as PageItem) ||
    ({} as Campaign | Promotion);

  const [editingBanner, setEditingBanner] = useState<boolean>(false);

  console.log(pageItems);

  return (
    <>
      {!editingBanner && (
        <div className="w-[600px] overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th className="w-1/3">Name</th>
                <th className="w-1/3">Type</th>
                <th className="w-1/3"></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{banner?.name}</td>
                <td>
                  {capitalizeFirst(getBlockContentType(pageItems[0]) ?? "")}
                </td>
                <td>
                  <button
                    type="submit"
                    className="btn-primary btn-md"
                    onClick={() => setEditingBanner(true)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {editingBanner && (
        <>
          <Form className="my-3 flex flex-col gap-3">
            <div className="flex w-max flex-row gap-3">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Content Type</span>
                </label>
                <select
                  name="contentType"
                  className="select-bordered select w-[95vw] sm:w-[215px]"
                  defaultValue="Select Content Type"
                  placeholder="Select a Type"
                  onChange={(e) => {
                    searchParams.set("contentType", e.target.value);
                    submit(searchParams, {
                      method: "GET",
                    });
                  }}
                >
                  <option value="">Select Content Type</option>
                  <option value="promotion">Promotion</option>
                  <option value="campaign">Campaign</option>
                </select>
              </div>

              <div className="flex flex-row gap-6">
                <div className="form-control w-full max-w-xs">
                  <label className="label">
                    <span className="label-text">Search By Name</span>
                  </label>
                  <SearchInput name="name" placeholder="Name" />
                </div>
              </div>
            </div>

            <p className="mt-3 text-xs">Select an Item</p>

            <div className="max-w-3xl overflow-x-auto">
              <table className="table-xs table">
                <thead>
                  <tr>
                    <th></th>
                    <th>Name</th>
                    <th>Created</th>
                    <th>Go To</th>
                  </tr>
                </thead>
                <tbody>
                  {searchResults?.map(
                    ({ name, createdAt }: Promotion | Campaign, index) => {
                      return (
                        <tr
                          key={"promotionOrCampaign_" + name + index}
                          className="hover cursor-pointer"
                          onClick={() => {
                            const formData = new FormData();
                            formData.set("_action", "updateBanner");
                            formData.set(
                              "pageId",
                              homePage.id.toString() || ""
                            );
                            formData.set("itemIndex", "0");
                            formData.set("blockType", "banner");
                            formData.set(
                              "contentType",
                              searchParams.get("contentType") as string
                            );
                            formData.set(
                              "contentData",
                              JSON.stringify(searchResults[index]) as string
                            );

                            submit(formData, {
                              method: "POST",
                            });

                            setEditingBanner(false);
                          }}
                        >
                          <th>{index + 1}</th>
                          <td>{name}</td>
                          <td>
                            {new Date(createdAt).toLocaleDateString("en-US", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </td>
                          <td>
                            <div className="ml-2">
                              <IoCaretForwardCircleSharp />
                            </div>
                          </td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>
            </div>
          </Form>
          <button
            type="button"
            className="btn-primary btn-md mt-3"
            onClick={() => setEditingBanner(false)}
          >
            Back
          </button>
        </>
      )}
    </>
  );
};

export default HomePageBannerBuilder;
