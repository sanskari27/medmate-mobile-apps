import { ApiError } from '../api/problem';
import type { Account, Session } from '../../types/session';
import { isRecord } from '../../utils/record';

export function parseSession(value: unknown): Session {
  const record = isRecord(value) ? value : {};
  const account = isRecord(record.account) ? record.account : {};
  const accessToken = asString(record.accessToken);
  const refreshToken = asString(record.refreshToken);
  const expiresIn = asNumber(record.expiresIn);
  const id = asString(account.id);
  const accountType = asString(account.accountType);
  const phone = asString(account.phone);
  if (!accessToken || !refreshToken || expiresIn === null || !id || !accountType || !phone) {
    throw new ApiError(500, 'Unexpected response', 'Session was not accepted');
  }
  return {
    accessToken,
    refreshToken,
    expiresIn,
    account: accountFrom(account, id, accountType, phone),
  };
}

function accountFrom(
  account: Record<string, unknown>,
  id: string,
  accountType: string,
  phone: string,
): Account {
  return {
    id,
    accountType,
    phone,
    displayName: asStringOrNull(account.displayName),
    pharmacyId: asStringOrNull(account.pharmacyId),
    pharmacyRole: asStringOrNull(account.pharmacyRole),
    verificationStatus: asStringOrNull(account.verificationStatus),
    subtypes: asStringList(account.subtypes),
    permissions: asStringList(account.permissions),
    pinSetupRequired: account.pinSetupRequired === true,
    disabled: account.disabled === true,
  };
}

function asString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function asStringOrNull(value: unknown): string | null {
  return typeof value === 'string' ? value : null;
}

function asNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  return null;
}

function asStringList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === 'string');
}
