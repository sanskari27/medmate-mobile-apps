import type { RootState } from '../root.reducer';

export function selectHomeStatus(state: RootState) {
  return state.home.status;
}

export function selectHomeSections(state: RootState) {
  return state.home.sections;
}

export function selectHomePharmacies(state: RootState) {
  return state.home.pharmacies;
}

export function selectHomeError(state: RootState) {
  return state.home.error;
}
