import { createHash } from "node:crypto";

export type UploadKind = "FOTO" | "VIDEO" | "AUDIO";

export const CLOUDINARY_FOLDER = "thelovers/pedidos";
export const LOCAL_FILES_PREFIX = "/api/files/";

const ALLOWED_FORMATS: Record<UploadKind, string> = {
  FOTO: "jpg,jpeg,png",
  VIDEO: "mp4",
  AUDIO: "mp3",
};

export function cloudinaryConfig() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  return cloudName && apiKey && apiSecret ? { cloudName, apiKey, apiSecret } : null;
}

export function localStorageEnabled() {
  return process.env.NODE_ENV !== "production" && !cloudinaryConfig();
}

export function storageAvailable() {
  return Boolean(cloudinaryConfig()) || localStorageEnabled();
}

export function signCloudinaryUpload(kind: UploadKind) {
  const config = cloudinaryConfig();
  if (!config) return null;

  const timestamp = Math.floor(Date.now() / 1000);
  const params: Record<string, string | number> = {
    allowed_formats: ALLOWED_FORMATS[kind],
    folder: CLOUDINARY_FOLDER,
    timestamp,
  };
  const toSign = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");
  const signature = createHash("sha1").update(toSign + config.apiSecret).digest("hex");
  const resourceType = kind === "FOTO" ? "image" : "video";

  return {
    provider: "cloudinary" as const,
    uploadUrl: `https://api.cloudinary.com/v1_1/${config.cloudName}/${resourceType}/upload`,
    fields: { ...params, api_key: config.apiKey, signature },
  };
}

export function isAllowedFileUrl(url: string) {
  const config = cloudinaryConfig();
  if (config && url.startsWith(`https://res.cloudinary.com/${config.cloudName}/`)) return true;
  if (localStorageEnabled() && url.startsWith(LOCAL_FILES_PREFIX)) return true;
  return false;
}
