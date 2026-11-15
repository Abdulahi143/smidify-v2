import "server-only";
import { headers } from "next/headers";
import { connection } from "next/server";
import { localStudioPreviewEnabled } from "./studio-preview-policy";

export async function isLocalStudioPreview(): Promise<boolean> {
  if (
    process.env.NODE_ENV !== "development" ||
    process.env.SMIDIFY_STUDIO_PREVIEW !== "1"
  )
    return false;
  await connection();
  return localStudioPreviewEnabled({
    mode: process.env.NODE_ENV,
    enabled: process.env.SMIDIFY_STUDIO_PREVIEW,
    host: (await headers()).get("host"),
  });
}
