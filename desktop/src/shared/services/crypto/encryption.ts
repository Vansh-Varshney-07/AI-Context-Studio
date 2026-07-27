const ALGORITHM = "AES-GCM";
const KEY_LENGTH = 256;
const IV_LENGTH = 12;

async function getEncryptionKey(): Promise<CryptoKey> {
  const stored = localStorage.getItem("aistudio.encryption.key");
  if (stored) {
    const rawKey = base64ToArrayBuffer(stored);
    return crypto.subtle.importKey("raw", rawKey.buffer as ArrayBuffer, { name: ALGORITHM }, false, [
      "encrypt",
      "decrypt",
    ]);
  }

  const key = await crypto.subtle.generateKey(
    { name: ALGORITHM, length: KEY_LENGTH },
    true,
    ["encrypt", "decrypt"]
  );

  const exported = await crypto.subtle.exportKey("raw", key);
  localStorage.setItem("aistudio.encryption.key", arrayBufferToBase64(exported));
  return key;
}

export async function encrypt(text: string): Promise<string> {
  const key = await getEncryptionKey();
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
  const encoded = new TextEncoder().encode(text);
  const ciphertext = await crypto.subtle.encrypt(
    { name: ALGORITHM, iv },
    key,
    encoded
  );
  const combined = new Uint8Array(IV_LENGTH + ciphertext.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(ciphertext), IV_LENGTH);
  return arrayBufferToBase64(combined.buffer);
}

export async function decrypt(encrypted: string): Promise<string> {
  const key = await getEncryptionKey();
  const combined = base64ToArrayBuffer(encrypted);
  const iv = combined.slice(0, IV_LENGTH) as Uint8Array<ArrayBuffer>;
  const ciphertext = combined.slice(IV_LENGTH);
  const plaintext = await crypto.subtle.decrypt(
    { name: ALGORITHM, iv },
    key,
    ciphertext
  );
  return new TextDecoder().decode(plaintext);
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i] ?? 0);
  }
  return btoa(binary);
}

function base64ToArrayBuffer(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}
