import { supabase } from "@/lib/supabase";

const MAX_AVATAR_SIZE = 2 * 1024 * 1024;
const MAX_RESUME_SIZE = 5 * 1024 * 1024;

type UploadKind = "avatar" | "resume";

function assertUpload(kind: UploadKind, file: File) {
  const allowed =
    kind === "avatar"
      ? ["image/jpeg", "image/png", "image/webp"]
      : ["application/pdf"];
  const maxSize = kind === "avatar" ? MAX_AVATAR_SIZE : MAX_RESUME_SIZE;

  if (!allowed.includes(file.type)) {
    throw new Error(kind === "avatar" ? "Avatar must be JPG, PNG, or WebP." : "Resume must be a PDF.");
  }

  if (file.size > maxSize) {
    throw new Error(kind === "avatar" ? "Avatar must be 2MB or smaller." : "Resume must be 5MB or smaller.");
  }
}

export async function uploadProfileAsset(kind: UploadKind, userId: string, file: File) {
  if (!supabase) {
    throw new Error("Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.");
  }

  assertUpload(kind, file);

  const extension = file.name.split(".").pop()?.toLowerCase() || (kind === "resume" ? "pdf" : "png");
  const bucket = kind === "avatar" ? "avatars" : "resumes";
  const path = `${userId}/${crypto.randomUUID()}.${extension}`;

  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: "3600",
    upsert: false
  });

  if (error) {
    throw new Error(error.message);
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}
