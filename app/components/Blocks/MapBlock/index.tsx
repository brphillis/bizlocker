import { ClientOnly } from "~/components/Utility/ClientOnly";
import Map from "~/components/Map/index.client";
import { generateColor } from "~/utility/colors";
import { IoCall, IoLocationSharp, IoPrint } from "react-icons/io5";
import { getCountrFromISO3166 } from "~/utility/countryList";
type Props = {
  content: BlockContent;
  options: BlockOptions[];
};

const MapBlock = ({ content, options: optionsArray }: Props) => {
  const options = optionsArray[0];
  const {
    borderRadius,
    borderDisplay,
    borderSize,
    borderColor,
    size,
    title,
    titleSize,
    titleWeight,
    titleAlign,
    titleColor,
    margin,
    itemBorderColor,
    itemBorderDisplay,
    itemBorderRadius,
    itemBorderSize,
    itemColor,
  } = options || {};

  const locations = content.store as Store[];

  const blockHeight = (): string => {
    switch (size) {
      case "small":
        return "250px";

      case "medium":
        return "450px";

      case "large":
        return "650px";

      default:
        return "450px";
    }
  };

  return (
    <div
      className={`flex w-full flex-col gap-6 px-0 max-md:gap-3 max-md:px-3 ${margin}`}
    >
      <h1
        style={{ color: generateColor(titleColor || "BLACK") }}
        className={`relative ${titleSize} ${titleAlign} ${titleWeight} w-full pb-0 max-md:py-3`}
      >
        {title}
      </h1>
      <div
        className={`relative z-0 w-full ${borderDisplay} overflow-hidden`}
        style={{
          borderRadius: borderRadius || "unset",
          height: blockHeight(),
          border:
            borderSize && borderColor
              ? `${borderSize} solid ${generateColor(borderColor)}`
              : "unset",
        }}
      >
        <ClientOnly fallback={<div id="skeleton" />}>
          {() => (
            <Map
              locations={locations}
              markerColor={generateColor(itemColor || "BLUE")}
            />
          )}
        </ClientOnly>
      </div>

      <div className="mx-auto grid w-max max-w-[1280px] grid-cols-3 gap-3 max-lg:grid-cols-2 max-sm:w-full max-sm:grid-cols-1">
        {locations.map(
          ({ name, address, phoneNumber, faxNumber }: Store, index: number) => {
            const {
              addressLine1,
              addressLine2,
              suburb,
              state,
              postcode,
              country,
            } = address;
            return (
              <div
                key={"card_" + index}
                style={{
                  borderRadius: itemBorderRadius || "unset",
                  border:
                    itemBorderSize && itemBorderColor
                      ? `${itemBorderSize} solid ${generateColor(
                          itemBorderColor
                        )}`
                      : "unset",
                }}
                className={`relative flex flex-col justify-center overflow-hidden bg-gray-50 ${itemBorderDisplay}`}
              >
                <div className="group relative bg-white px-6 pb-8 pt-6 shadow-xl ring-1 ring-gray-900/5 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl sm:mx-auto sm:px-10">
                  <span
                    style={{
                      backgroundColor: generateColor(itemColor || "BLUE"),
                    }}
                    className="absolute top-6 z-0 h-14 w-14 rounded-full  transition-all duration-500 group-hover:scale-[18]"
                  ></span>
                  <div className="relative z-10 mx-auto">
                    <div className="flex flex-row items-center gap-3">
                      <div
                        style={{
                          backgroundColor: generateColor(itemColor || "BLUE"),
                        }}
                        className="grid h-14 w-14 place-items-center rounded-full transition-all duration-500 "
                      >
                        <IoLocationSharp size={24} color="white" />
                      </div>
                      <div
                        className="font-bold text-brand-black transition-all duration-500 group-hover:text-brand-white"
                        group-hover:text-brand-white
                      >
                        {name}
                      </div>
                    </div>
                    <div className="duration-600 min-w-[400px] space-y-6 pt-5 text-base text-brand-black transition-all group-hover:text-brand-white">
                      <p>
                        {addressLine1}{" "}
                        {addressLine2 ? " / " + addressLine2 : ""}
                        <br />
                        {suburb + " " + state + " " + postcode}
                        <br />
                        {getCountrFromISO3166(country)?.toUpperCase()}
                      </p>
                    </div>
                    <div className="pt-5 font-semibold leading-7 group-hover:text-brand-white">
                      <p>
                        <div className="flex cursor-pointer items-center gap-3">
                          <div
                            style={{
                              backgroundColor: generateColor(
                                itemColor || "BLUE"
                              ),
                            }}
                            className="rounded-full p-1 text-brand-white"
                          >
                            <IoCall size={14} />
                          </div>
                          <a
                            className="transition-all duration-500 hover:scale-110"
                            href={`tel:${phoneNumber}`}
                          >
                            {phoneNumber}
                          </a>
                        </div>
                        <div className="mt-1 flex cursor-pointer items-center gap-3">
                          <div
                            style={{
                              backgroundColor: generateColor(
                                itemColor || "BLUE"
                              ),
                            }}
                            className="rounded-full p-1 text-brand-white"
                          >
                            <IoPrint size={14} />
                          </div>

                          <a
                            className="transition-all duration-500 hover:scale-110"
                            href={`tel:${faxNumber}`}
                          >
                            {faxNumber.slice(0, 2) + " " + faxNumber.slice(2)}
                          </a>
                        </div>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          }
        )}
      </div>
    </div>
  );
};

export default MapBlock;
