import { secureGet, secureSet, secureDelete } from '@/services/internal/secureStorage';

// COMPLIANCE: Ley 25.326 (Protección de Datos Personales) requires recording
// the exact moment a user explicitly consents to data collection.
// Timestamp is stored locally and must be synced to the backend on registration.

const CONSENT_KEY = 'privacy_consent_timestamp';

export async function saveConsentTimestamp(): Promise<void> {
  await secureSet(CONSENT_KEY, new Date().toISOString());
}

export async function getConsentTimestamp(): Promise<string | null> {
  return secureGet(CONSENT_KEY);
}

export async function clearConsentTimestamp(): Promise<void> {
  await secureDelete(CONSENT_KEY);
}
