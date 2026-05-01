"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { clearDemoSession, hasDemoSession, signOut } from "@/lib/auth";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import { adminPurgeAllData } from "@/lib/admin-api";

export default function AdminSettingsPage() {
  const router = useRouter();
  const [resetting, setResetting] = useState(false);
  const [purging, setPurging] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [changing, setChanging] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isDemo = useMemo(() => hasDemoSession(), []);

  const handleReset = async () => {
    if (!confirm("Reset admin session and sign out?")) return;
    setResetting(true);
    setMessage(null);
    setError(null);
    try {
      clearDemoSession();
      await signOut();
      router.replace("/admin/login");
      window.location.reload();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Reset failed.");
    } finally {
      setResetting(false);
    }
  };

  const handleChangePassword = async () => {
    setMessage(null);
    setError(null);
    if (isDemo) {
      setError("Demo admin cannot change password. Sign in with a real Firebase admin account.");
      return;
    }
    const user = auth?.currentUser;
    if (!user || !user.email) {
      setError("Not signed in.");
      return;
    }
    if (!currentPassword || !newPassword) {
      setError("Please enter current and new password.");
      return;
    }
    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }

    setChanging(true);
    try {
      const cred = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, cred);
      await updatePassword(user, newPassword);
      setCurrentPassword("");
      setNewPassword("");
      setMessage("Password updated successfully.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Password update failed.");
    } finally {
      setChanging(false);
    }
  };

  const handlePurge = async () => {
    setMessage(null);
    setError(null);
    if (isDemo) {
      setError("Demo admin cannot delete live data. Sign in with a real Firebase admin account.");
      return;
    }

    const inputConfirm = prompt('Type "DELETE ALL DATA" to confirm:');
    if (!inputConfirm) return;
    if (inputConfirm !== "DELETE ALL DATA") {
      setError('Confirmation text did not match. Type "DELETE ALL DATA" exactly.');
      return;
    }

    const inputPassword = prompt("Enter admin delete password to continue:");
    if (inputPassword === null) return;

    setPurging(true);
    try {
      await adminPurgeAllData({ confirm: inputConfirm, password: inputPassword });
      setMessage("All data deleted successfully.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed.");
    } finally {
      setPurging(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl font-bold text-slate-800">Settings</h1>
      <p className="mt-1 text-slate-600">Admin session and account settings.</p>

      {(error || message) && (
        <div
          className={`mt-6 p-4 rounded-xl text-sm ${
            error ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"
          }`}
        >
          {error || message}
        </div>
      )}

      <section className="mt-8 bg-white rounded-2xl shadow-soft border border-slate-100 p-6">
        <h2 className="font-display font-semibold text-slate-800">Reset</h2>
        <p className="mt-1 text-sm text-slate-600">
          Clears demo session (if any) and signs you out.
        </p>
        <div className="mt-4">
          <button
            type="button"
            onClick={handleReset}
            disabled={resetting}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-60"
          >
            {resetting ? "Resetting..." : "Reset session"}
          </button>
        </div>
      </section>

      <section className="mt-4 bg-white rounded-2xl shadow-soft border border-slate-100 p-6">
        <h2 className="font-display font-semibold text-slate-800">Change password</h2>
        <p className="mt-1 text-sm text-slate-600">
          Works for real Firebase admin accounts (not demo).
        </p>
        <div className="mt-4 grid gap-3">
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Current password"
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
          />
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New password (min 6 chars)"
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
          />
          <div>
            <button
              type="button"
              onClick={handleChangePassword}
              disabled={changing}
              className="px-4 py-2.5 rounded-xl bg-primary text-white hover:bg-primary/90 disabled:opacity-60"
            >
              {changing ? "Updating..." : "Update password"}
            </button>
          </div>
        </div>
      </section>

      <section className="mt-4 bg-white rounded-2xl shadow-soft border border-red-100 p-6">
        <h2 className="font-display font-semibold text-slate-800">Danger zone</h2>
        <p className="mt-1 text-sm text-slate-600">
          Permanently deletes data from Firestore (jobs, employers, candidates, applications, job requests, analytics).
        </p>
        <div className="mt-4">
          <button
            type="button"
            onClick={handlePurge}
            disabled={purging}
            className="px-4 py-2.5 rounded-xl bg-red-600 text-white hover:bg-red-700 disabled:opacity-60"
          >
            {purging ? "Deleting..." : "Delete data"}
          </button>
        </div>
      </section>
    </div>
  );
}

