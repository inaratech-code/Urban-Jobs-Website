"use client";

import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";
import { auth } from "./firebase";
import { doc, getDoc } from "firebase/firestore/lite";
import { db } from "./firebase";
import type { User } from "@/types";

const DEMO_STORAGE_KEY = "urban_jobs_demo_admin";

const ADMIN_EMAILS = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

const DEMO_EMAIL = (process.env.NEXT_PUBLIC_DEMO_ADMIN_EMAIL || "admin@demo.com").trim().toLowerCase();
const DEMO_PASSWORD = process.env.NEXT_PUBLIC_DEMO_ADMIN_PASSWORD || "Demo@123";

export function getDemoCredentials(): { email: string; password: string } | null {
  if (typeof window === "undefined") return { email: DEMO_EMAIL, password: DEMO_PASSWORD };
  return { email: DEMO_EMAIL, password: DEMO_PASSWORD };
}

export function tryDemoLogin(email: string, password: string): boolean {
  return email.trim().toLowerCase() === DEMO_EMAIL && password === DEMO_PASSWORD;
}

export function setDemoSession() {
  if (typeof window !== "undefined") localStorage.setItem(DEMO_STORAGE_KEY, "1");
}

export function clearDemoSession() {
  if (typeof window !== "undefined") localStorage.removeItem(DEMO_STORAGE_KEY);
}

export function hasDemoSession(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(DEMO_STORAGE_KEY) === "1";
}

export async function signIn(email: string, password: string) {
  if (tryDemoLogin(email, password)) {
    setDemoSession();
    return {} as Awaited<ReturnType<typeof signInWithEmailAndPassword>>;
  }
  if (!auth) throw new Error("Firebase Auth not configured");
  return signInWithEmailAndPassword(auth, email, password);
}

export function signOut(): Promise<void> {
  clearDemoSession();
  if (auth) return firebaseSignOut(auth);
  return Promise.resolve();
}

export function getCurrentUser(): FirebaseUser | null {
  return auth?.currentUser ?? null;
}

export function onAuthChange(callback: (user: FirebaseUser | null) => void) {
  if (!auth) {
    if (hasDemoSession()) {
      callback({ email: DEMO_EMAIL, uid: "demo" } as FirebaseUser);
    } else {
      callback(null);
    }
    return () => {};
  }
  const unsub = onAuthStateChanged(auth, (u) => {
    if (u) return callback(u);
    if (hasDemoSession()) return callback({ email: DEMO_EMAIL, uid: "demo" } as FirebaseUser);
    callback(null);
  });
  return unsub;
}

export async function getUserRole(email: string): Promise<User["role"]> {
  if (ADMIN_EMAILS.includes(email.toLowerCase())) return "admin";
  const usersRef = doc(db, "users", email.replace(/\./g, "_"));
  const snap = await getDoc(usersRef);
  if (snap.exists()) return (snap.data() as User).role;
  return "candidate";
}

export function isAdminEmail(email: string): boolean {
  const e = email?.toLowerCase() || "";
  if (e === DEMO_EMAIL) return true;
  return ADMIN_EMAILS.includes(e);
}

