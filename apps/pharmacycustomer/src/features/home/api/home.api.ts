import { requestJson } from '../../../services/api/client';
import { createRequestId } from '../../../services/network/request-id';
import {
  parseAppSections,
  parseCoupons,
  parseNearbyPharmacies,
  parseWallet,
} from '../schemas/home.schema';
import type { AppSection, HomeCoupon, NearbyPharmacy, WalletSnapshot } from '../types/home';

export type HomeApi = {
  listSections: (token: string) => Promise<AppSection[]>;
  listNearby: (token: string, latitude: number, longitude: number) => Promise<NearbyPharmacy[]>;
  listCoupons: (token: string) => Promise<HomeCoupon[]>;
  readWallet: (token: string) => Promise<WalletSnapshot>;
};

export function createHomeApi(baseUrl: string, fetchImpl?: typeof fetch): HomeApi {
  const send = (path: string, token: string) =>
    requestJson(baseUrl, { method: 'GET', path, token, requestId: createRequestId() }, fetchImpl);

  return {
    async listSections(token) {
      return parseAppSections(await send('/api/v1/customer/app-sections', token));
    },
    async listNearby(token, latitude, longitude) {
      const query = new URLSearchParams({
        latitude: String(latitude),
        longitude: String(longitude),
      });
      return parseNearbyPharmacies(
        await send(`/api/v1/customer/pharmacies/nearby?${query.toString()}`, token),
      );
    },
    async listCoupons(token) {
      return parseCoupons(await send('/api/v1/coupons', token));
    },
    async readWallet(token) {
      return parseWallet(await send('/api/v1/customer/wallet', token));
    },
  };
}
