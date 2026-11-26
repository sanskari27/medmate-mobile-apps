import type { RootState } from '../root.reducer';

export function selectAddressStatus(state: RootState) {
  return state.address.status;
}

export function selectAddresses(state: RootState) {
  return state.address.items;
}

export function selectAddressError(state: RootState) {
  return state.address.error;
}

export function selectSelectedAddress(state: RootState) {
  return state.address.items.find((item) => item.selected) ?? null;
}

export function selectAwaitingAddressPick(state: RootState) {
  return state.address.awaitingPick;
}
