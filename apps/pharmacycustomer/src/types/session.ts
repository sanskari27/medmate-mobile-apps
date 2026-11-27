export type Account = {
  id: string;
  accountType: string;
  phone: string;
  email: string | null;
  displayName: string | null;
  pharmacyId: string | null;
  pharmacyRole: string | null;
  verificationStatus: string | null;
  subtypes: string[];
  permissions: string[];
  pinSetupRequired: boolean;
  disabled: boolean;
};

export type Session = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  account: Account;
};

export function hasSession(session: Session | null): session is Session {
  return session !== null;
}
