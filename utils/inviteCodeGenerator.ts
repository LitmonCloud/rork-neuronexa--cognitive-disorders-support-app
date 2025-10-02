const BASE32_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function generateRandomString(length: number): string {
  let result = '';
  const bytes = new Uint8Array(length);
  
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < length; i++) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
  }
  
  for (let i = 0; i < length; i++) {
    result += BASE32_CHARS[bytes[i] % BASE32_CHARS.length];
  }
  
  return result;
}

export function generateInviteCode(): string {
  const part1 = generateRandomString(4);
  const part2 = generateRandomString(4);
  return `${part1}-${part2}`;
}

export function formatInviteCode(code: string): string {
  const cleaned = code.replace(/[^A-Z0-9]/gi, '').toUpperCase();
  if (cleaned.length <= 4) {
    return cleaned;
  }
  return `${cleaned.slice(0, 4)}-${cleaned.slice(4, 8)}`;
}

export function validateInviteCodeFormat(code: string): boolean {
  const cleaned = code.replace(/[^A-Z0-9]/gi, '');
  return cleaned.length === 8;
}

export function generateDeepLink(code: string): string {
  return `neuronexa://caregiver/join?code=${code}`;
}

export function getExpirationTime(): Date {
  const now = new Date();
  now.setMinutes(now.getMinutes() + 15);
  return now;
}

export function isExpired(expiresAt: Date): boolean {
  return new Date() > new Date(expiresAt);
}

export function getRemainingTime(expiresAt: Date): number {
  const now = new Date().getTime();
  const expires = new Date(expiresAt).getTime();
  return Math.max(0, expires - now);
}

export function formatRemainingTime(milliseconds: number): string {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}
