import type { BlockOptions } from "@prisma/client";
import type { BlockMasterOptions } from "~/utility/blockMaster/blockMaster";
import ToolTip from "~/components/Indicators/ToolTip";

type Props = {
  defaultValues?: BlockOptions;
  colors: string[];
  selectedBlockOptions?: BlockMasterOptions;
};

const BackgroundOptions = ({
  defaultValues,
  colors,
  selectedBlockOptions,
}: Props) => {
  const {
    backgroundColor,
    backgroundWidth,
    backgroundColorSecondary,
    backgroundWidthSecondary,
    backgroundPatternColor,
    backgroundPatternName,
    backgroundPatternOpacity,
    backgroundPatternSize,
    backgroundPatternColorSecondary,
    backgroundPatternNameSecondary,
    backgroundPatternOpacitySecondary,
    backgroundPatternSizeSecondary,
    backgroundBrightness,
    backgroundBrightnessSecondary,
  } = defaultValues || {};

  return (
    <details className="collapse !hidden !max-w-full !rounded-sm bg-brand-white/20 [&:has(div>div)]:!grid">
      <summary className="collapse-title text-xl font-medium">
        Background
      </summary>
      <div className="collapse-content relative sm:!px-3">
        <div className="flex max-w-full flex-wrap justify-start !gap-3 pb-3 max-md:justify-center">
          {selectedBlockOptions?.backgroundColor && (
            <div className="form-control relative max-sm:items-center">
              <ToolTip tip="Background color of the main item" />
              <label className="label max-sm:ml-3 max-sm:!self-start">
                <span className="label-text text-brand-white">
                  Background Color
                </span>
              </label>
              <select
                name="backgroundColor"
                className="select w-[95vw] text-brand-black/75 sm:w-[215px]"
                placeholder="Select a Color"
                defaultValue={!backgroundColor ? undefined : backgroundColor}
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

          {selectedBlockOptions?.backgroundWidth && (
            <div className="form-control relative max-sm:items-center">
              <ToolTip tip="Option to extend the background width" />
              <label className="label max-sm:ml-3 max-sm:!self-start">
                <span className="label-text text-brand-white">
                  Background Width
                </span>
              </label>
              <select
                name="backgroundWidth"
                className="select w-[95vw] text-brand-black/75 sm:w-[215px]"
                placeholder="Select a Width"
                defaultValue={!backgroundWidth ? undefined : backgroundWidth}
              >
                <option value="">Select a Width</option>
                <option value="100%">Container Width</option>
                <option value="100vw">Screen Width</option>
              </select>
            </div>
          )}

          {selectedBlockOptions?.backgroundBrightness && (
            <div className="form-control relative max-sm:items-center">
              <ToolTip tip="Brightness Filter ( Blank for Default )" />
              <label className="label max-sm:ml-3 max-sm:!self-start">
                <span className="label-text text-brand-white">
                  Background Brightness
                </span>
              </label>
              <input
                name="backgroundBrightness"
                type="number"
                step="any"
                className="input input-bordered w-[95vw] max-w-full text-brand-black sm:w-[215px]"
                placeholder="Default"
                defaultValue={backgroundBrightness || undefined}
              />
            </div>
          )}

          {selectedBlockOptions?.backgroundPatternName && (
            <div className="form-control relative max-sm:items-center">
              <ToolTip tip="Add a pattern when your content has no background" />
              <label className="label max-sm:ml-3 max-sm:!self-start">
                <span className="label-text text-brand-white">
                  Background Pattern
                </span>
              </label>
              <select
                name="backgroundPatternName"
                className="select w-[95vw] text-brand-black/75 sm:w-[215px]"
                placeholder="Select a Color"
                defaultValue={
                  !backgroundPatternName ? undefined : backgroundPatternName
                }
              >
                <option value="">None</option>
                <option value="wavy">Wavy</option>
                <option value="isometric">Isometric</option>
              </select>
            </div>
          )}

          {selectedBlockOptions?.backgroundPatternColor && (
            <div className="form-control relative max-sm:items-center">
              <ToolTip tip="Color of the selected pattern" />
              <label className="label max-sm:ml-3 max-sm:!self-start">
                <span className="label-text text-brand-white">
                  Pattern Color
                </span>
              </label>
              <select
                name="backgroundPatternColor"
                className="select w-[95vw] text-brand-black/75 sm:w-[215px]"
                placeholder="Select a Color"
                defaultValue={
                  !backgroundPatternColor ? undefined : backgroundPatternColor
                }
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

          {selectedBlockOptions?.backgroundPatternSize && (
            <div className="form-control relative max-sm:items-center">
              <ToolTip tip="Size of the pattern shapes, between 0 - 120" />
              <label className="label max-sm:ml-3 max-sm:!self-start">
                <span className="label-text text-brand-white">
                  Pattern Size
                </span>
              </label>
              <input
                name="backgroundPatternSize"
                type="number"
                max="120"
                className="input input-bordered w-[95vw] max-w-full text-brand-black sm:w-[215px]"
                placeholder="Size"
                defaultValue={backgroundPatternSize || undefined}
              />
            </div>
          )}

          {selectedBlockOptions?.backgroundPatternOpacity && (
            <div className="form-control relative max-sm:items-center">
              <ToolTip tip="Opacity of the pattern layer, between 0 - 1" />
              <label className="label max-sm:ml-3 max-sm:!self-start">
                <span className="label-text text-brand-white">
                  Pattern Opacity
                </span>
              </label>
              <input
                name="backgroundPatternOpacity"
                type="number"
                step="any"
                className="input input-bordered w-[95vw] max-w-full text-brand-black sm:w-[215px]"
                placeholder="Opacity"
                defaultValue={backgroundPatternOpacity || undefined}
              />
            </div>
          )}
        </div>

        <div className="flex max-w-full flex-wrap justify-start !gap-3 pb-3 max-md:justify-center">
          {selectedBlockOptions?.backgroundColorSecondary && (
            <div className="form-control relative max-sm:items-center">
              <ToolTip tip="Usually the background color of behind the entire main item" />
              <label className="label max-sm:ml-3 max-sm:!self-start">
                <span className="label-text text-brand-white">
                  Secondary Background Color
                </span>
              </label>
              <select
                name="backgroundColorSecondary"
                className="select w-[95vw] text-brand-black/75 sm:w-[215px]"
                placeholder="Select a Color"
                defaultValue={
                  !backgroundColorSecondary
                    ? undefined
                    : backgroundColorSecondary
                }
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

          {selectedBlockOptions?.backgroundWidthSecondary && (
            <div className="form-control relative max-sm:items-center">
              <ToolTip tip="Option to extend the background width" />
              <label className="label max-sm:ml-3 max-sm:!self-start">
                <span className="label-text text-brand-white">
                  Secondary Background Width
                </span>
              </label>
              <select
                name="backgroundWidthSecondary"
                className="select w-[95vw] text-brand-black/75 sm:w-[215px]"
                placeholder="Select a Width"
                defaultValue={
                  !backgroundWidthSecondary
                    ? undefined
                    : backgroundWidthSecondary
                }
              >
                <option value="">Select a Width</option>
                <option value="100%">Container Width</option>
                <option value="100vw">Screen Width</option>
              </select>
            </div>
          )}

          {selectedBlockOptions?.backgroundBrightnessSecondary && (
            <div className="form-control relative max-sm:items-center">
              <ToolTip tip="Brightness Filter ( Blank for Default )" />
              <label className="label max-sm:ml-3 max-sm:!self-start">
                <span className="label-text text-brand-white">
                  Second Background Brightness
                </span>
              </label>
              <input
                name="backgroundBrightnessSecondary"
                type="number"
                step="any"
                className="input input-bordered w-[95vw] max-w-full text-brand-black sm:w-[215px]"
                placeholder="Default Brightness"
                defaultValue={backgroundBrightnessSecondary || undefined}
              />
            </div>
          )}

          {selectedBlockOptions?.backgroundPatternNameSecondary && (
            <div className="form-control relative max-sm:items-center">
              <ToolTip tip="Add a pattern when your content has no background" />
              <label className="label max-sm:ml-3 max-sm:!self-start">
                <span className="label-text text-brand-white">
                  Second Background Pattern
                </span>
              </label>
              <select
                name="backgroundPatternNameSecondary"
                className="select w-[95vw] text-brand-black/75 sm:w-[215px]"
                placeholder="Select a Color"
                defaultValue={
                  !backgroundPatternNameSecondary
                    ? undefined
                    : backgroundPatternNameSecondary
                }
              >
                <option value="">None</option>
                <option value="wavy">Wavy</option>
                <option value="isometric">Isometric</option>
              </select>
            </div>
          )}

          {selectedBlockOptions?.backgroundPatternColorSecondary && (
            <div className="form-control relative max-sm:items-center">
              <ToolTip tip="Color of the selected pattern" />
              <label className="label max-sm:ml-3 max-sm:!self-start">
                <span className="label-text text-brand-white">
                  Second Pattern Color
                </span>
              </label>
              <select
                name="backgroundPatternColorSecondary"
                className="select w-[95vw] text-brand-black/75 sm:w-[215px]"
                placeholder="Select a Color"
                defaultValue={
                  !backgroundPatternColorSecondary
                    ? undefined
                    : backgroundPatternColorSecondary
                }
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

          {selectedBlockOptions?.backgroundPatternSizeSecondary && (
            <div className="form-control relative max-sm:items-center">
              <ToolTip tip="Size of the pattern shapes, between 0 - 120" />
              <label className="label max-sm:ml-3 max-sm:!self-start">
                <span className="label-text text-brand-white">
                  Second Pattern Size
                </span>
              </label>
              <input
                name="backgroundPatternSizeSecondary"
                type="number"
                max="120"
                className="input input-bordered w-[95vw] max-w-full text-brand-black sm:w-[215px]"
                placeholder="Size"
                defaultValue={backgroundPatternSizeSecondary || undefined}
              />
            </div>
          )}

          {selectedBlockOptions?.backgroundPatternOpacitySecondary && (
            <div className="form-control relative max-sm:items-center">
              <ToolTip tip="Opacity of the pattern layer, between 0 - 1" />
              <label className="label max-sm:ml-3 max-sm:!self-start">
                <span className="label-text text-brand-white">
                  Second Pattern Opacity
                </span>
              </label>
              <input
                name="backgroundPatternOpacitySecondary"
                type="number"
                step="any"
                className="input input-bordered w-[95vw] max-w-full text-brand-black sm:w-[215px]"
                placeholder="Opacity"
                defaultValue={backgroundPatternOpacitySecondary || undefined}
              />
            </div>
          )}
        </div>
      </div>
    </details>
  );
};

export default BackgroundOptions;
