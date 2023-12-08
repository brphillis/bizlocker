import type { Address } from "@prisma/client";

export const findClosestPostcode = (
  targetLat: number,
  targetLon: number,
  postcodeList: Address[]
): string | null => {
  let closestPostcode: string | null = null;
  let minDistance = Number.MAX_VALUE;

  for (const postcode of postcodeList) {
    const { postcode: currentPostcode, latitude, longitude } = postcode;

    if (latitude && longitude && currentPostcode) {
      const distance = calculateDistance(
        targetLat,
        targetLon,
        parseFloat(latitude),
        parseFloat(longitude)
      );

      if (distance < minDistance) {
        minDistance = distance;
        closestPostcode = currentPostcode;
      }
    }
  }

  return closestPostcode;
};

const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  // The radius of the Earth in kilometers
  const R = 6371;

  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  // Distance in kilometers
  const distance = R * c;
  return distance;
};
