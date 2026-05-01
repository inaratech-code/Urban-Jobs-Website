import "server-only";

import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

function getServiceAccount() {
  const raw =
    process.env.FIREBASE_SERVICE_ACCOUNT_KEY ||
    process.env.FIREBASE_SERVICE_ACCOUNT ||
    "";
  if (!raw.trim()) return null;

  try {
    const json = JSON.parse(raw) as { private_key?: string };
    // Common when env var is pasted with literal \n
    if (json.private_key) {
      json.private_key = json.private_key.replace(/\\n/g, "\n");
    }
    return json;
  } catch {
    return null;
  }
}

export function getAdminDb() {
  if (!getApps().length) {
    const serviceAccount = getServiceAccount();
    if (!serviceAccount) {
      throw new Error(
        "Server Firebase Admin is not configured. Set FIREBASE_SERVICE_ACCOUNT_KEY to your service account JSON (stringified)."
      );
    }
    initializeApp({ credential: cert(serviceAccount as Parameters<typeof cert>[0]) });
  }
  return getFirestore();
}

