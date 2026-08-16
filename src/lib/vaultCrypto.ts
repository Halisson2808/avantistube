import * as OTPAuth from 'otpauth';

export interface BackupCodeItem {
  id?: string;
  code: string;
  used: boolean;
}

export interface VaultAccount {
  id: string;
  channelName: string;
  channelUrl?: string;
  email: string;
  password?: string;
  secret2fa: string; // Base32 ou URI otpauth://
  backupCodes?: BackupCodeItem[]; // 10 Códigos de Backup (Google)
  notes?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface EncryptedPayload {
  version: number;
  salt: string; // Base64
  iv: string; // Base64
  ciphertext: string; // Base64
  updatedAt: string;
}

// ─── Web Crypto API Helpers (AES-256-GCM + PBKDF2) ──────────────────────────

function bufferToBase64(buf: ArrayBuffer | Uint8Array): string {
  const bytes = new Uint8Array(buf);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

function base64ToBuffer(b64: string): Uint8Array {
  const binary = window.atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const passwordKey = await window.crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    passwordKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Criptografa a lista de contas usando AES-256-GCM com a senha mestre.
 */
export async function encryptVault(
  accounts: VaultAccount[],
  masterPassword: string
): Promise<EncryptedPayload> {
  const salt = window.crypto.getRandomValues(new Uint8Array(16));
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(masterPassword, salt);

  const enc = new TextEncoder();
  const plaintext = JSON.stringify(accounts);
  const ciphertextBuffer = await window.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    enc.encode(plaintext)
  );

  return {
    version: 1,
    salt: bufferToBase64(salt),
    iv: bufferToBase64(iv),
    ciphertext: bufferToBase64(ciphertextBuffer),
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Descriptografa o payload do cofre com a senha mestre.
 * Lança erro caso a senha esteja incorreta ou os dados corrompidos.
 */
export async function decryptVault(
  payload: EncryptedPayload,
  masterPassword: string
): Promise<VaultAccount[]> {
  try {
    const salt = base64ToBuffer(payload.salt);
    const iv = base64ToBuffer(payload.iv);
    const ciphertext = base64ToBuffer(payload.ciphertext);
    const key = await deriveKey(masterPassword, salt);

    const decryptedBuffer = await window.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      ciphertext
    );

    const dec = new TextDecoder();
    const jsonStr = dec.decode(decryptedBuffer);
    const accounts = JSON.parse(jsonStr) as VaultAccount[];
    return accounts;
  } catch (err) {
    throw new Error('Senha mestre incorreta ou cofre corrompido.');
  }
}

// ─── TOTP Generator (Google Authenticator RFC 6238) ──────────────────────────

/**
 * Normaliza o secret: remove espaços, traços e se for otpauth:// extrai o segredo
 */
export function cleanSecret(rawSecret: string): string {
  if (!rawSecret) return '';
  const trimmed = rawSecret.trim();

  // Se o usuário colou a URL completa do QR Code (otpauth://totp/...)
  if (trimmed.startsWith('otpauth://')) {
    try {
      const parsed = OTPAuth.URI.parse(trimmed);
      return parsed.secret.base32;
    } catch {
      const match = trimmed.match(/[?&]secret=([A-Z2-7=]+)/i);
      if (match && match[1]) return match[1].toUpperCase().replace(/\s/g, '');
    }
  }

  // Remove espaços comuns de formatação (ex: 'JBSW Y3DP EHPK')
  return trimmed.replace(/[\s-]/g, '').toUpperCase();
}

export interface TotpResult {
  token: string;
  remainingSeconds: number;
  progressPercent: number;
  isValid: boolean;
  error?: string;
}

/**
 * Gera o código TOTP atual e o tempo restante (0-30s).
 */
export function generateTotp(rawSecret: string): TotpResult {
  const secret = cleanSecret(rawSecret);
  const nowInSeconds = Math.floor(Date.now() / 1000);
  const period = 30;
  const remainingSeconds = period - (nowInSeconds % period);
  const progressPercent = (remainingSeconds / period) * 100;

  if (!secret) {
    return {
      token: '------',
      remainingSeconds: 0,
      progressPercent: 0,
      isValid: false,
      error: 'Segredo 2FA não informado',
    };
  }

  try {
    const totp = new OTPAuth.TOTP({
      issuer: 'YouTube',
      label: 'Channel',
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
      secret: OTPAuth.Secret.fromBase32(secret),
    });

    const token = totp.generate();
    return {
      token,
      remainingSeconds,
      progressPercent,
      isValid: true,
    };
  } catch (err) {
    return {
      token: 'ERRO',
      remainingSeconds,
      progressPercent,
      isValid: false,
      error: 'Formato Base32 inválido',
    };
  }
}

// ─── Backup Codes Parser (10 Códigos de Backup do Google) ────────────────────

/**
 * Analisa texto colado (do Google) e extrai os códigos de backup (ex: 8 dígitos como 12345678 ou 1234 5678).
 */
export function parseBackupCodes(raw: string): BackupCodeItem[] {
  if (!raw) return [];
  const lines = raw.split(/[\n,;]/);
  const result: BackupCodeItem[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Tenta encontrar padrões de 8 dígitos (com ou sem espaço, ex: 1234 5678 ou 12345678)
    const matches = trimmed.match(/\b\d{4}\s?\d{4}\b/g);
    if (matches && matches.length > 0) {
      for (const m of matches) {
        const clean = m.replace(/\s+/g, '');
        if (clean.length === 8) {
          result.push({ code: `${clean.slice(0, 4)} ${clean.slice(4)}`, used: false });
        }
      }
    } else {
      // Se for outro formato de código alfanumérico ou de backup
      const cleanGeneric = trimmed.replace(/^[0-9]+[.):\s-]*/, '').trim();
      if (cleanGeneric && cleanGeneric.length >= 6) {
        result.push({ code: cleanGeneric, used: false });
      }
    }
  }

  // Remove duplicados se houver
  const unique = result.filter(
    (item, index, self) => index === self.findIndex((t) => t.code === item.code)
  );

  return unique.slice(0, 20);
}
