export type SectionImage = {
  contentType: string;
  url: string;
};

export type AppSection = {
  id: string;
  category: string;
  position: number;
  image: SectionImage;
};

export function pharmacyTitle(name: string | null, fallback: string): string {
  return name || fallback;
}

export type NearbyPharmacy = {
  pharmacyId: string;
  name: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
  latitude: number;
  longitude: number;
  distanceKm: number;
  acceptOnlineOrders: boolean;
};
