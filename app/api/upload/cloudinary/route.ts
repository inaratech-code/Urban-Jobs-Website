import { NextRequest, NextResponse } from "next/server";
import {
  getCloudinaryUploadConfig,
  cloudinaryConfigErrorMessage,
} from "@/lib/cloudinary-config";

const MAX_BYTES = 15 * 1024 * 1024; // 15 MB

export async function POST(req: NextRequest) {
  const cfg = getCloudinaryUploadConfig();
  if (!cfg) {
    return NextResponse.json({ error: cloudinaryConfigErrorMessage() }, { status: 500 });
  }
  const { cloudName, uploadPreset } = cfg;

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data." }, { status: 400 });
  }

  const file = formData.get("file");
  const folder = (formData.get("folder") as string) || "urban-jobs/uploads";

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File too large (max 15 MB)." }, { status: 400 });
  }

  const upstream = new FormData();
  upstream.append("file", file);
  upstream.append("upload_preset", uploadPreset);
  upstream.append("folder", folder);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
    { method: "POST", body: upstream }
  );

  if (!response.ok) {
    const text = await response.text();
    return NextResponse.json(
      { error: text || "Upload failed." },
      { status: response.status }
    );
  }

  const json = (await response.json()) as { secure_url?: string };
  if (!json.secure_url) {
    return NextResponse.json({ error: "Missing secure_url in response." }, { status: 502 });
  }

  return NextResponse.json({ url: json.secure_url });
}
