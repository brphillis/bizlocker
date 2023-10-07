import { useFetcher } from "@remix-run/react";
import { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import DarkOverlay from "~/components/Layout/DarkOverlay";

type Props = {
  itemIndexToUpdate: number | undefined;
  setItemIndexToUpdate: Function;
  updateItemsFunction: Function;
  items: Image[];
};

const SelectPageLinkPopupFormModule = ({
  itemIndexToUpdate,
  setItemIndexToUpdate,
  updateItemsFunction,
  items,
}: Props) => {
  const [currentWebPages, setCurrentWebPages] = useState<Page[]>();
  const fetcher = useFetcher();
  const count = 10;
  const [title, setTitle] = useState<string>();

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data == null) {
      let query = "/api/searchPages";

      const params = [];
      if (title !== null && title !== undefined) {
        params.push(`title=${title}`);
      }

      if (count !== null && count !== undefined) {
        params.push(`perPage=${count.toString()}`);
      }

      if (params.length > 0) {
        query += `?${params.join("&")}`;
      }

      fetcher.load(query);
    }

    if (fetcher.data) {
      const { webPages } = fetcher.data;
      setCurrentWebPages(webPages);
    }
  }, [fetcher, currentWebPages, count, title]);

  const searchWebPages = () => {
    let query = "/api/searchPages";

    const params = [];
    if (title !== null && title !== undefined) {
      params.push(`title=${title}`);
    }

    if (count !== null && count !== undefined) {
      params.push(`perPage=${count.toString()}`);
    }

    if (params.length > 0) {
      query += `?${params.join("&")}`;
    }

    fetcher.load(query);

    if (fetcher.data) {
      const { webPages } = fetcher.data;
      setCurrentWebPages(webPages);
    }
  };

  const handleUpdateItem = (pageTitle: string) => {
    if (itemIndexToUpdate !== undefined) {
      const newItems = [...items];
      newItems[itemIndexToUpdate].url = `/${pageTitle}`;

      updateItemsFunction(newItems);
      setItemIndexToUpdate(undefined);
    }
  };

  return (
    <DarkOverlay>
      <div className="relative flex w-[480px] max-w-[100vw] flex-col items-center justify-center gap-6 rounded-none bg-brand-black px-0 py-6 sm:rounded-md sm:px-6">
        <button
          type="button"
          className="absolute right-3 top-3 cursor-pointer text-brand-white"
        >
          <IoClose onClick={() => setItemIndexToUpdate(undefined)} />
        </button>

        <div className="flex flex-col">
          <h2 className="mb-6 text-center text-2xl font-bold text-brand-white">
            Select Page Link
          </h2>
          <div className="flex flex-row gap-6">
            <div className="form-control w-full sm:w-[215px]">
              <input
                name="title"
                type="text"
                placeholder="Search Page Title..."
                className="input input-bordered w-full text-brand-black"
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
              />
            </div>

            <button
              type="button"
              className="btn btn-primary btn-sm !h-[41px] w-max"
              onClick={searchWebPages}
            >
              Search
            </button>
          </div>
        </div>

        <table className="table table-sm">
          <thead className="sticky top-0 text-brand-white">
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Path</th>
            </tr>
          </thead>
          <tbody>
            {currentWebPages &&
              currentWebPages.map(({ id, title }: Page, i: number) => {
                return (
                  <tr
                    className="hover cursor-pointer text-brand-white transition-colors duration-200 hover:bg-brand-black/75"
                    key={id}
                    onClick={() => handleUpdateItem(title)}
                  >
                    <td>{i + 1}</td>
                    <td>{title}</td>

                    <td>{"/" + title}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </DarkOverlay>
  );
};

export default SelectPageLinkPopupFormModule;
