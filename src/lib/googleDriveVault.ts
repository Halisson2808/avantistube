/**
 * googleDriveVault.ts
 * Integração com Google Drive API (OAuth 2.0) e Backup Local de Arquivos.
 */

const VAULT_FILENAME = 'avantistube_vault.enc';
const GOOGLE_DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest';
const SCOPES = 'https://www.googleapis.com/auth/drive.file';

export interface GoogleDriveStatus {
  isConnected: boolean;
  userEmail?: string;
  lastSyncedAt?: string;
}

// ─── Export / Import de Arquivo Local (Backup Rápido) ─────────────────────────

export function downloadVaultFile(encryptedJson: string) {
  const blob = new Blob([encryptedJson], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const date = new Date().toISOString().split('T')[0];
  a.href = url;
  a.download = `avantistube_backup_${date}.enc.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function readVaultFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      resolve(text);
    };
    reader.onerror = (e) => reject(e);
    reader.readAsText(file);
  });
}

// ─── Google Drive REST API ───────────────────────────────────────────────────

/**
 * Salva ou atualiza o arquivo avantistube_vault.enc no Google Drive do usuário.
 */
export async function uploadToGoogleDrive(
  accessToken: string,
  encryptedJson: string
): Promise<{ fileId: string; modifiedTime: string }> {
  // 1. Procurar se já existe o arquivo no Drive
  const searchRes = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=name='${VAULT_FILENAME}' and trashed=false&fields=files(id,name,modifiedTime)`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  if (!searchRes.ok) {
    throw new Error(`Erro ao consultar Google Drive: ${searchRes.statusText}`);
  }

  const searchData = await searchRes.json();
  const existingFile = searchData.files && searchData.files.length > 0 ? searchData.files[0] : null;

  const metadata = {
    name: VAULT_FILENAME,
    mimeType: 'application/json',
    description: 'Backup Criptografado do Cofre 2FA do Avantis Studio',
  };

  const fileContent = new Blob([encryptedJson], { type: 'application/json' });
  const form = new FormData();
  form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
  form.append('file', fileContent);

  if (existingFile) {
    // Atualizar arquivo existente
    const updateRes = await fetch(
      `https://www.googleapis.com/upload/drive/v3/files/${existingFile.id}?uploadType=multipart&fields=id,modifiedTime`,
      {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${accessToken}` },
        body: form,
      }
    );

    if (!updateRes.ok) {
      throw new Error(`Erro ao atualizar arquivo no Drive: ${updateRes.statusText}`);
    }

    const updateData = await updateRes.json();
    return { fileId: updateData.id, modifiedTime: updateData.modifiedTime || new Date().toISOString() };
  } else {
    // Criar novo arquivo
    const createRes = await fetch(
      'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,modifiedTime',
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}` },
        body: form,
      }
    );

    if (!createRes.ok) {
      throw new Error(`Erro ao criar arquivo no Drive: ${createRes.statusText}`);
    }

    const createData = await createRes.json();
    return { fileId: createData.id, modifiedTime: createData.modifiedTime || new Date().toISOString() };
  }
}

/**
 * Baixa o arquivo avantistube_vault.enc do Google Drive.
 */
export async function downloadFromGoogleDrive(
  accessToken: string
): Promise<{ encryptedJson: string; modifiedTime: string } | null> {
  const searchRes = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=name='${VAULT_FILENAME}' and trashed=false&fields=files(id,name,modifiedTime)`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  if (!searchRes.ok) {
    throw new Error(`Erro ao consultar Google Drive: ${searchRes.statusText}`);
  }

  const searchData = await searchRes.json();
  if (!searchData.files || searchData.files.length === 0) {
    return null;
  }

  const file = searchData.files[0];
  const fileRes = await fetch(`https://www.googleapis.com/drive/v3/files/${file.id}?alt=media`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!fileRes.ok) {
    throw new Error(`Erro ao baixar arquivo do Drive: ${fileRes.statusText}`);
  }

  const encryptedJson = await fileRes.text();
  return { encryptedJson, modifiedTime: file.modifiedTime };
}
