import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getFirestore } from "firebase/firestore/lite";
import { getStorage } from "firebase/storage";
import { getAuth, Auth } from "firebase/auth";

const ENV_KEYS = [
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
  "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
  "NEXT_PUBLIC_FIREBASE_APP_ID",
] as const;

function envTrim(key: (typeof ENV_KEYS)[number]): string | undefined {
  const v = process.env[key]?.trim();
  return v || undefined;
}

/** All six web config values must be set (NEXT_PUBLIC_* are baked in at build time on Vercel — redeploy after changes). */
const hasConfig = ENV_KEYS.every((k) => Boolean(envTrim(k)));

/** False when any Firebase web env var is missing — otherwise app used dummy project id `build`. */
export const isFirebaseConfigured = hasConfig;

export function assertFirebaseConfigured(): void {
  if (!hasConfig) {
    const missing = ENV_KEYS.filter((k) => !envTrim(k));
    throw new Error(
      "Firebase is not fully configured. Missing or empty: " +
        missing.join(", ") +
        ". Copy all six from Firebase Console → Project settings → Your apps → Web app. " +
        "On Vercel, set them under Environment Variables for Production (and Preview if needed), then redeploy — " +
        "NEXT_PUBLIC_* values are embedded at build time, not picked up on old deployments."
    );
  }
}

const firebaseConfig = hasConfig
  ? {
      apiKey: envTrim("NEXT_PUBLIC_FIREBASE_API_KEY"),
      authDomain: envTrim("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"),
      projectId: envTrim("NEXT_PUBLIC_FIREBASE_PROJECT_ID"),
      storageBucket: envTrim("NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"),
      messagingSenderId: envTrim("NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"),
      appId: envTrim("NEXT_PUBLIC_FIREBASE_APP_ID"),
    }
  : {
      apiKey: "build-placeholder",
      authDomain: "localhost",
      projectId: "build",
      storageBucket: "build",
      messagingSenderId: "0",
      appId: "1",
    };

let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0] as FirebaseApp;
}

export const db = getFirestore(app);
export const storage = getStorage(app);

let _auth: Auth | null = null;
try {
  _auth = getAuth(app);
} catch {
  _auth = null;
}
export const auth = _auth;
export default app;

