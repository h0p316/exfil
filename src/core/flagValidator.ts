import { FLAG_HASHES } from './flagHashes';

export async function sha256hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function validateFlag(challengeId: string, attempt: string): Promise<boolean> {
  const expected = FLAG_HASHES[challengeId];
  if (!expected) return false;
  const hash = await sha256hex(attempt.trim());
  return hash === expected;
}
