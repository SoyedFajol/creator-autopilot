import * as crypto from 'node:crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const TAG_LENGTH = 16;

/**
 * Encrypts a sensitive string using AES-256-GCM.
 * The key must be a 32-byte Buffer or a 64-char hex string.
 */
export function encryptSecret(plainText: string, keyHexOrString: string): string {
  let keyBuffer: Buffer;
  if (/^[0-9a-fA-F]{64}$/.test(keyHexOrString)) {
    keyBuffer = Buffer.from(keyHexOrString, 'hex');
  } else {
    // Derive 32-byte key using SHA-256
    keyBuffer = crypto.createHash('sha256').update(keyHexOrString).digest();
  }

  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, keyBuffer, iv);

  let encrypted = cipher.update(plainText, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag();

  // Return formatted payload: iv:tag:encryptedData (all in hex)
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
}

/**
 * Decrypts a payload encrypted with AES-256-GCM.
 */
export function decryptSecret(encryptedPayload: string, keyHexOrString: string): string {
  const parts = encryptedPayload.split(':');
  if (parts.length !== 3) {
    throw new Error('Invalid encrypted payload format. Expected iv:tag:ciphertext');
  }

  const [ivHex, tagHex, cipherHex] = parts;

  let keyBuffer: Buffer;
  if (/^[0-9a-fA-F]{64}$/.test(keyHexOrString)) {
    keyBuffer = Buffer.from(keyHexOrString, 'hex');
  } else {
    keyBuffer = crypto.createHash('sha256').update(keyHexOrString).digest();
  }

  const iv = Buffer.from(ivHex, 'hex');
  const tag = Buffer.from(tagHex, 'hex');

  if (iv.length !== IV_LENGTH || tag.length !== TAG_LENGTH) {
    throw new Error('Invalid IV or Auth Tag length in ciphertext');
  }

  const decipher = crypto.createDecipheriv(ALGORITHM, keyBuffer, iv);
  decipher.setAuthTag(tag);

  let decrypted = decipher.update(cipherHex, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}
