export type UploadKind = "FOTO" | "VIDEO" | "AUDIO";

export interface UploadedRef {
  url: string;
  publicId: string;
  bytes: number;
}

interface SignResponse {
  provider?: "cloudinary" | "local";
  uploadUrl?: string;
  fields?: Record<string, string | number>;
  error?: string;
}

function postForm(url: string, form: FormData, onProgress?: (fraction: number) => void) {
  return new Promise<Record<string, unknown>>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) onProgress?.(event.loaded / event.total);
    };
    xhr.onload = () => {
      let data: Record<string, unknown> = {};
      try {
        data = JSON.parse(xhr.responseText);
      } catch {
        // respuesta no JSON
      }
      if (xhr.status >= 200 && xhr.status < 300) resolve(data);
      else reject(new Error(typeof data.error === "string" ? data.error : "No se pudo subir el archivo."));
    };
    xhr.onerror = () => reject(new Error("Se perdió la conexión mientras subíamos tu archivo."));
    xhr.send(form);
  });
}

export async function uploadFile(
  file: File,
  kind: UploadKind,
  onProgress?: (fraction: number) => void,
): Promise<UploadedRef> {
  const signResponse = await fetch("/api/upload/sign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ kind, size: file.size, type: file.type }),
  });
  const sign = (await signResponse.json().catch(() => ({}))) as SignResponse;
  if (!signResponse.ok || !sign.uploadUrl) {
    throw new Error(sign.error ?? "No se pudo preparar la subida del archivo.");
  }

  const form = new FormData();
  if (sign.provider === "cloudinary" && sign.fields) {
    Object.entries(sign.fields).forEach(([key, value]) => form.append(key, String(value)));
  } else {
    form.append("kind", kind);
  }
  form.append("file", file);

  const result = await postForm(sign.uploadUrl, form, onProgress);
  const url = result.secure_url;
  if (typeof url !== "string") throw new Error("La subida no devolvió la dirección del archivo.");

  return {
    url,
    publicId: typeof result.public_id === "string" ? result.public_id : "",
    bytes: typeof result.bytes === "number" ? result.bytes : file.size,
  };
}
