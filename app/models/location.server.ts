type LocationResponseType = {
  lat: string;
  lon: string;
};

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

    if (data) {
      const location = data as LocationResponseType;
      return { lat: parseFloat(location.lat), long: parseFloat(location.lon) };
    } else {
      return null; // Postcode not found
    }
  } catch (error) {
    console.error("Error fetching geolocation data:", error);
    return null;
  }
};
