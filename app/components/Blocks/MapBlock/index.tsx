import { useRef } from "react";
import { BlockOptions } from "@prisma/client";
import Map from "~/components/Map/index.client";
import { BlockContentSorted } from "~/models/Blocks/types";
import { MapFunctions } from "~/components/Map/types";
import { getCountryFromISO3166 } from "~/utility/countryList";
import { IoCall, IoLocationSharp, IoPrint } from "react-icons/io5";
import {
  getThemeColorValueByName,
  returnOtherColorPrefix,
} from "~/utility/colors";
import { StoreWithDetails } from "~/models/Stores/types";
import { ClientOnly } from "~/components/Client/ClientOnly";

type Props = {
  content: BlockContentSorted[];
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
    titleFontWeight,
    titleAlign,
    titleColor,
    margin,
    itemBorderDisplays,
    colorPrimary,
  } = options || {};

  const locations = content.map((e) => e.store) as StoreWithDetails[];

  const mapRef = useRef<MapFunctions | null>(null);

  const handleNavigate = (lat: number, long: number) => {
    if (mapRef.current) {
      mapRef.current.navigateToSpot(lat, long, 15);
    }
  };

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
      {title && (
        <h1
          className={`relative w-full pb-0 max-md:py-3 ${titleSize} ${titleAlign} ${titleFontWeight} ${titleColor}`}
        >
          {title}
        </h1>
      )}
      <div
        className={`relative z-0 w-full overflow-hidden ${borderDisplay} ${borderRadius} ${borderSize} ${borderColor}`}
        style={{ height: blockHeight() }}
      >
        <ClientOnly fallback={<div id="skeleton" />}>
          <Map
            ref={mapRef}
            locations={locations}
            markerColor={getThemeColorValueByName(colorPrimary || "BLUE")}
          />
        </ClientOnly>
      </div>

      <div className="mx-auto grid w-max max-w-[1280px] grid-cols-3 gap-3 max-lg:grid-cols-2 max-sm:w-full max-sm:grid-cols-1">
        {locations.map(
          (
            { name, address, phoneNumber, faxNumber }: StoreWithDetails,
            index: number,
          ) => {
            const {
              addressLine1,
              addressLine2,
              suburb,
              state,
              postcode,
              country,
              latitude,
              longitude,
            } = address || {};
            return (
              <button
                key={"mapBlock_card_" + index}
                type="button"
                className={`relative z-0 flex cursor-pointer flex-col justify-center overflow-hidden bg-gray-50 ${itemBorderDisplays[index]} ${borderRadius}`}
                onClick={() =>
                  latitude &&
                  longitude &&
                  handleNavigate(parseFloat(latitude), parseFloat(longitude))
                }
              >
                <div className="group relative bg-white px-6 pb-8 pt-6 shadow-xl ring-1 ring-gray-900/5 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl sm:mx-auto sm:px-10">
                  <span className="absolute top-6 z-0 h-14 w-14 rounded-full  transition-all duration-500 group-hover:scale-[18]"></span>
                  <div className="relative z-10 mx-auto">
                    <div className="flex flex-row items-center gap-3">
                      <div
                        className={`grid h-14 w-14 place-items-center rounded-full transition-all duration-500 ${
                          colorPrimary
                            ? returnOtherColorPrefix(colorPrimary, "text-")
                            : "text-brand-black"
                        }`}
                      >
                        <IoLocationSharp size={42} />
                      </div>
                      <div className="font-bold text-brand-black transition-all duration-500 text-xl max-md:text-lg">
                        {name}
                      </div>
                    </div>
                    <div className="duration-600 min-w-[400px] space-y-6 pt-5 text-base text-brand-black">
                      <p>
                        {addressLine1}{" "}
                        {addressLine2 ? " / " + addressLine2 : ""}
                        <br />
                        {suburb + " " + state + " " + postcode}
                        <br />
                        {country &&
                          getCountryFromISO3166(country)?.toUpperCase()}
                      </p>
                    </div>
                    <div className="pt-5 font-semibold leading-7">
                      <div>
                        <div className="flex cursor-pointer items-center gap-3">
                          <div
                            className={`rounded-full p-1 ${
                              colorPrimary
                                ? returnOtherColorPrefix(colorPrimary, "text-")
                                : "text-brand-black"
                            }`}
                          >
                            <IoCall size={22} />
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
                            className={`rounded-full p-1 ${
                              colorPrimary
                                ? returnOtherColorPrefix(colorPrimary, "text-")
                                : "text-brand-black"
                            }`}
                          >
                            <IoPrint size={22} />
                          </div>

                          <a
                            className="transition-all duration-500 hover:scale-110"
                            href={`tel:${faxNumber}`}
                          >
                            {faxNumber?.slice(0, 2) + " " + faxNumber?.slice(2)}
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            );
          },
        )}
      </div>
    </div>
  );
};

export default MapBlock;
