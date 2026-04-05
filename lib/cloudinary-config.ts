/**
 * Cloudinary upload config for API routes / server.
 * Prefer CLOUDINARY_* (server-only on Vercel); NEXT_PUBLIC_* still supported for local/dev.
 */
export function getCloudinaryUploadConfig():
  | { cloudName: string; uploadPreset: string }
  | null {
  const cloudName =
    process.env.CLOUDINARY_CLOUD_NAME?.trim() ||
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME?.trim();
  const uploadPreset =
    process.env.CLOUDINARY_UPLOAD_PRESET?.trim() ||
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET?.trim();
  if (!cloudName || !uploadPreset) return null;
  return { cloudName, uploadPreset };
}

/** Shown in the app when upload API rejects the request (site owners: fix env, then redeploy). */
export function cloudinaryConfigErrorMessage(): string {
  return (
    "File upload isn’t set up yet. Add CLOUDINARY_CLOUD_NAME and CLOUDINARY_UPLOAD_PRESET " +
    "in your hosting environment (e.g. Vercel → Project → Settings → Environment Variables), " +
    "then redeploy. Use an unsigned upload preset from the Cloudinary dashboard."
  );
}
