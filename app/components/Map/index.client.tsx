import { forwardRef, useImperativeHandle, useRef } from "react";
import L, { LatLngTuple, Map as LeafletMap } from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { IoCall, IoPrint } from "react-icons/io5";
import { StoreWithDetails } from "~/models/Stores/types";
import { getCountryFromISO3166 } from "~/utility/countryList";
import { MapFunctions } from "./types";

import "leaflet/dist/leaflet.css";

type Props = {
  locations: StoreWithDetails[];
  markerColor?: string;
};

const Map = forwardRef<MapFunctions, Props>(
  ({ locations, markerColor }, ref) => {
    Map.displayName = "Map";
    const mapRef = useRef<LeafletMap | null>(null);
    const startLat = locations?.[0]?.address?.latitude
      ? parseFloat(locations?.[0]?.address.latitude)
      : 0;
    const startLong = locations?.[0]?.address?.longitude
      ? parseFloat(locations?.[0].address.longitude)
      : 0;
    const position: LatLngTuple = [startLat, startLong];

    const navigateToSpot = (
      latitude: number,
      longitude: number,
      newZoom: number,
    ) => {
      if (mapRef.current) {
        const leafletMap = mapRef.current;
        leafletMap.setView([latitude, longitude], newZoom);
      }
    };
    useImperativeHandle(ref, () => ({
      navigateToSpot,
    }));

    const markerSvg = `<svg width="20" height="20" viewBox="0 0 20 20" fill="${
      markerColor || "black"
    }" xmlns="http://www.w3.org/2000/svg"> <path fill-rule="evenodd" clip-rule="evenodd" d="M5.05025 4.05025C7.78392 1.31658 12.2161 1.31658 14.9497 4.05025C17.6834 6.78392 17.6834 11.2161 14.9497 13.9497L10 18.8995L5.05025 13.9497C2.31658 11.2161 2.31658 6.78392 5.05025 4.05025ZM10 11C11.1046 11 12 10.1046 12 9C12 7.89543 11.1046 7 10 7C8.89543 7 8 7.89543 8 9C8 10.1046 8.89543 11 10 11Z" fill="${
      markerColor || "black"
    }"/> </svg>`;
    const iconUrl = "data:image/svg+xml;base64," + btoa(markerSvg);

    const customIcon = new L.Icon({
      iconUrl: iconUrl,
      iconSize: [32, 32],
      popupAnchor: [-0, -10],
    });

    return (
      <MapContainer
        ref={mapRef}
        center={position}
        zoom={4}
        scrollWheelZoom={true}
        style={{
          height: "100%",
          width: "100%",
        }}
      >
        <TileLayer
          attribution='<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.jawg.io/jawg-terrain/{z}/{x}/{y}{r}.png?access-token=1lEbNED1FzrHXM3rJpDwbOWJaX543b4We5n304qZc6Pb9JyvcrAYYrXMuobUvUMy"
        />
        {locations &&
          locations.map(
            (
              { name, phoneNumber, faxNumber, address }: StoreWithDetails,
              index: number,
            ) => {
              const {
                addressLine1,
                addressLine2,
                suburb,
                state,
                country,
                postcode,
                latitude,
                longitude,
              } = address || {};

              if (latitude && longitude) {
                return (
                  <Marker
                    key={"mapLocation_" + index}
                    position={[parseFloat(latitude), parseFloat(longitude)]}
                    icon={customIcon}
                  >
                    <Popup
                      closeButton={true}
                      className="min-w-[220px] !rounded-none"
                    >
                      <div className="flex flex-col">
                        <div className="text-lg font-semibold">{name}</div>
                        <div className="my-3 flex flex-col items-start gap-[2px]">
                          <div>{addressLine1}</div>
                          <div>{addressLine2}</div>
                          <div>{suburb + " " + state + " " + postcode}</div>
                          <div>
                            {country &&
                              getCountryFromISO3166(country)?.toUpperCase()}
                          </div>
                        </div>

                        <div className="flex flex-col items-start gap-1">
                          <div className="flex items-center gap-3">
                            <div className="rounded-full bg-primary p-1 text-brand-white">
                              <IoCall size={14} />
                            </div>
                            <a href={`tel:${phoneNumber}`} className="mt-1">
                              {phoneNumber}
                            </a>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="rounded-full bg-primary p-1 text-brand-white">
                              <IoPrint size={14} />
                            </div>
                            <a href={`tel:${faxNumber}`} className="mt-1">
                              {faxNumber?.slice(0, 2) +
                                " " +
                                faxNumber?.slice(2)}
                            </a>
                          </div>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                );
              } else return null;
            },
          )}
      </MapContainer>
    );
  },
);

export default Map;
