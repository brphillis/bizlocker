import { fetch } from "@remix-run/node";

export const getLatLongForPostcode = async (
  postcode: string
): Promise<{ lat: number; long: number } | null> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${postcode}`
    );

    if (!response.ok) {
      throw new Error(`Request failed with status: ${response.status}`);
    }

    const data = await response.json();

    if (data.length > 0) {
      const location = data[0];
      return { lat: parseFloat(location.lat), long: parseFloat(location.lon) };
    } else {
      return null; // Postcode not found
    }
  } catch (error) {
    console.error("Error fetching geolocation data:", error);
    return null;
  }
};
