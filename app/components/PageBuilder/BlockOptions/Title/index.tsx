import type { BlockOptions } from "@prisma/client";
import type { BlockName } from "~/utility/blockMaster/types";
import type { BlockMasterOptions } from "~/utility/blockMaster/blockMaster";

type Props = {
  selectedBlock?: BlockName;
  defaultValues?: BlockOptions;
  colors: string[];
  selectedBlockOptions?: BlockMasterOptions;
};

const TitleOptions = ({
  selectedBlock,
  defaultValues,
  colors,
  selectedBlockOptions,
}: Props) => {
  const { title, titleColor, titleSize, titleWeight, titleAlign } =
    defaultValues || {};

  return (
    <details className="collapse !hidden !max-w-full !rounded-sm bg-brand-white/20 [&:has(div>div)]:!grid">
      <summary className="collapse-title text-xl font-medium">
        {selectedBlock === "text" ? "Heading" : "Title"}
      </summary>
      <div className="flex max-w-full flex-wrap justify-start !gap-3 px-3 pb-3 max-md:justify-center max-md:px-0">
        {selectedBlockOptions?.title && (
          <div className="form-control max-sm:items-center">
            <label className="label max-sm:ml-3 max-sm:!self-start">
              <span className="label-text text-brand-white">Title</span>
            </label>
            <input
              name="title"
              type="text"
              className="input input-bordered w-[95vw] !text-brand-black/75 sm:w-[215px]"
              placeholder="Title"
              defaultValue={!title ? undefined : title}
            />
          </div>
        )}

        {selectedBlockOptions?.titleSize && (
          <div className="form-control max-sm:items-center">
            <label className="label max-sm:ml-3 max-sm:!self-start">
              <span className="label-text text-brand-white">Title Size</span>
            </label>
            <select
              name="titleSize"
              className=" select w-[95vw] max-w-full text-brand-black/75 sm:w-[215px]"
              placeholder="Select a Type"
              defaultValue={!titleSize ? undefined : titleSize}
            >
              <option value="text-xs">XSmall</option>
              <option value="text-sm">Small</option>
              <option value="text-base">Medium</option>
              <option value="text-lg">Large</option>
              <option value="text-xl">XL</option>
              <option value="text-2xl">2XL</option>
              <option value="text-3xl">3XL</option>
              <option value="text-4xl">4XL</option>
              <option value="text-5xl">5XL</option>
              <option value="text-6xl">6XL</option>
              <option value="text-7xl">7XL</option>
              <option value="text-8xl">8XL</option>
              <option value="text-9xl">9XL</option>
            </select>
          </div>
        )}

        {selectedBlockOptions?.titleWeight && (
          <div className="form-control max-sm:items-center">
            <label className="label max-sm:ml-3 max-sm:!self-start">
              <span className="label-text text-brand-white">Title Weight</span>
            </label>
            <select
              name="titleWeight"
              className=" select w-[95vw] max-w-full text-brand-black/75 sm:w-[215px]"
              placeholder="Select a Type"
              defaultValue={!titleWeight ? undefined : titleWeight}
            >
              <option value="font-thin">Thin</option>
              <option value="font-extralight">X Light</option>
              <option value="font-light">Light</option>
              <option value="font-normal">Normal</option>
              <option value="font-medium">Medium</option>
              <option value="font-semibold">Semi Bold</option>
              <option value="font-bold">Bold</option>
              <option value="font-extrabold">X Bold</option>
              <option value="font-black">Boldest</option>
            </select>
          </div>
        )}

        {selectedBlockOptions?.titleAlign && (
          <div className="form-control max-sm:items-center">
            <label className="label max-sm:ml-3 max-sm:!self-start">
              <span className="label-text text-brand-white">Title Align</span>
            </label>
            <select
              name="titleAlign"
              className=" select w-[95vw] max-w-full text-brand-black/75 sm:w-[215px]"
              placeholder="Select a Type"
              defaultValue={!titleAlign ? undefined : titleAlign}
            >
              <option value="text-left">Left</option>
              <option value="text-center">Center</option>
              <option value="text-right">Right</option>
            </select>
          </div>
        )}

        {selectedBlockOptions?.titleColor && (
          <div className="form-control max-sm:items-center">
            <label className="label max-sm:ml-3 max-sm:!self-start">
              <span className="label-text text-brand-white">
                {selectedBlock === "text" ? "Heading Color" : "Title Color"}
              </span>
            </label>
            <select
              name="titleColor"
              className="select w-[95vw] text-brand-black/75 sm:w-[215px]"
              placeholder="Select a Color"
              defaultValue={!titleColor ? undefined : titleColor}
            >
              <option value="">Select a Color</option>
              {colors?.map((color: string, i: number) => {
                return (
                  <option key={color + i} value={color}>
                    {color}
                  </option>
                );
              })}
            </select>
          </div>
        )}
      </div>
    </details>
  );
};

export default TitleOptions;
