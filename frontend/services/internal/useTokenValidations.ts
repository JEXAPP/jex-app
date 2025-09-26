import * as SecureStore from 'expo-secure-store';
import { jwtDecode } from 'jwt-decode';
import { doRefresh } from './api';

type Role = 'employee' | 'employer';
type ValidateOk = { ok: true; role: Role; reason: null };
type ValidateErr = {
  ok: false;
  role: Role | null;
  reason: 'NO_TOKEN_OR_INVALID' | 'ROLE_MISMATCH';
};
export type ValidateResult = ValidateOk | ValidateErr;

interface DecodedToken {
  role?: Role | null;
  exp?: number;
  [k: string]: any;
}

const isTokenExpired = (token: string): boolean => {
  try {
    const decoded: any = jwtDecode(token);
    if (!decoded.exp) return true;
    const now = Math.floor(Date.now() / 1000);
    return decoded.exp < now;
  } catch {
    return true;
  }
};

export const useTokenValidations = () => {
  const getRoleFromAccess = async (): Promise<Role | null> => {
    let accessToken = await SecureStore.getItemAsync('access');

    if (!accessToken || isTokenExpired(accessToken)) {
      const newAccess = await doRefresh();
      if (!newAccess) return null;
      accessToken = newAccess;
    }

    try {
      const decoded = jwtDecode<DecodedToken>(accessToken);
      return decoded.role ?? null;
    } catch {
      return null;
    }
  };

  const validateToken = async (expectedRole?: Role): Promise<ValidateResult> => {
    const role = await getRoleFromAccess();
    if (!role) return { ok: false, role: null, reason: 'NO_TOKEN_OR_INVALID' };
    if (expectedRole && role !== expectedRole) {
      return { ok: false, role, reason: 'ROLE_MISMATCH' };
    }
    return { ok: true, role, reason: null };
  };

  return { validateToken };
};
