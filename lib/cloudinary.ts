import { getCloudinaryUploadConfig, cloudinaryConfigErrorMessage } from "./cloudinary-config";

export async function uploadToCloudinary(
  file: File,
  folder = "urban-jobs/candidates"
): Promise<string> {
  if (typeof window !== "undefined") {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);
    const response = await fetch("/api/upload/cloudinary", {
      method: "POST",
      body: formData,
    });
    const json = (await response.json()) as { url?: string; error?: string };
    if (!response.ok) {
      throw new Error(json.error || "Upload failed.");
    }
    if (!json.url) {
      throw new Error("Upload failed: no URL returned.");
    }
    return json.url;
  }

  const cfg = getCloudinaryUploadConfig();
  if (!cfg) {
    throw new Error(cloudinaryConfigErrorMessage());
  }
  const { cloudName, uploadPreset } = cfg;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);
  formData.append("folder", folder);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Cloudinary upload failed: ${text || response.statusText}`);
  }

  const json = (await response.json()) as { secure_url?: string };
  if (!json.secure_url) {
    throw new Error("Cloudinary upload failed: secure_url missing in response.");
  }

  return json.secure_url;
}
