import { requestJson } from '../../../services/api/client';
import { createRequestId } from '../../../services/network/request-id';
import { parseAddressList, parseAddressResponse } from '../schemas/address.schema';
import type { Address, AddressInput } from '../types/address';

export type AddressApi = {
  list: (token: string) => Promise<Address[]>;
  create: (token: string, body: AddressInput) => Promise<Address>;
  update: (token: string, id: string, body: AddressInput) => Promise<Address>;
  select: (token: string, id: string) => Promise<Address>;
};

export function createAddressApi(baseUrl: string, fetchImpl?: typeof fetch): AddressApi {
  const send = (method: 'GET' | 'POST' | 'PATCH', path: string, token: string, body?: unknown) =>
    requestJson(baseUrl, { method, path, body, token, requestId: createRequestId() }, fetchImpl);

  return {
    async list(token) {
      return parseAddressList(await send('GET', '/api/v1/customer/addresses', token));
    },
    async create(token, body) {
      return parseAddressResponse(await send('POST', '/api/v1/customer/addresses', token, body));
    },
    async update(token, id, body) {
      return parseAddressResponse(
        await send('PATCH', `/api/v1/customer/addresses/${id}`, token, body),
      );
    },
    async select(token, id) {
      return parseAddressResponse(
        await send('POST', `/api/v1/customer/addresses/${id}/select`, token, {}),
      );
    },
  };
}
