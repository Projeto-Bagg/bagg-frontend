import { decodeJwt } from 'jose';

export function isTokenExpired(token: string) {
  try {
    const payload = decodeJwt(token);
    if (!payload || !payload.exp) {
      return true;
    }
    const now = Math.floor(Date.now() / 1000);
    return payload.exp < now;
  } catch (error) {
    return true;
  }
}
