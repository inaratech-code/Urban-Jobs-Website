import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getFirestore } from "firebase/firestore/lite";
import { getStorage } from "firebase/storage";
import { getAuth, Auth } from "firebase/auth";

/**
 * Must use static `process.env.NEXT_PUBLIC_*` access — Next.js inlines these at build time.
 * Dynamic access like `process.env[key]` is NOT replaced, so values are always undefined in the client bundle.
 */
const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.trim() || undefined;
const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN?.trim() || undefined;
const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID?.trim() || undefined;
const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET?.trim() || undefined;
const messagingSenderId =
  process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID?.trim() || undefined;
const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID?.trim() || undefined;

/** All six web config values must be set (NEXT_PUBLIC_* are baked in at build time on Vercel — redeploy after changes). */
const hasConfig = Boolean(
  apiKey && authDomain && projectId && storageBucket && messagingSenderId && appId
);

/** False when any Firebase web env var is missing — otherwise app used dummy project id `build`. */
export const isFirebaseConfigured = hasConfig;

export function assertFirebaseConfigured(): void {
  if (!hasConfig) {
    const missing: string[] = [];
    if (!apiKey) missing.push("NEXT_PUBLIC_FIREBASE_API_KEY");
    if (!authDomain) missing.push("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN");
    if (!projectId) missing.push("NEXT_PUBLIC_FIREBASE_PROJECT_ID");
    if (!storageBucket) missing.push("NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET");
    if (!messagingSenderId) missing.push("NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID");
    if (!appId) missing.push("NEXT_PUBLIC_FIREBASE_APP_ID");
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
      apiKey: apiKey!,
      authDomain: authDomain!,
      projectId: projectId!,
      storageBucket: storageBucket!,
      messagingSenderId: messagingSenderId!,
      appId: appId!,
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
