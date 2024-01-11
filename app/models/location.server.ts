type LocationResponseType = {
  lat: string;
  lon: string;
};

export const fetchLatLong = async (
  postcode: string,
  country?: string
): Promise<{ lat: number; long: number } | null> => {
  let apiString = `https://nominatim.openstreetmap.org/search?format=json&q=${postcode}`;

  if (country) {
    apiString += `,${country}`;
  }

  try {
    const response = await fetch(apiString);

    if (!response.ok) {
      throw new Error(`Request failed with status: ${response.status}`);
    }

    const data = await response.json();

    if (data) {
      const location = data[0] as LocationResponseType;
      return { lat: parseFloat(location.lat), long: parseFloat(location.lon) };
    } else {
      return null; // Postcode not found
    }
  } catch (error) {
    console.error("Error fetching geolocation data:", error);
    return null;
  }
};
