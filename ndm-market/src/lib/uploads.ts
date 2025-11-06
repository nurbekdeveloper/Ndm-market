import crypto from "crypto";
import { promises as fs } from "fs";
import path from "path";

type UploadFolder = "categories" | "brands" | "products" | "banners";

export async function saveUpload(file: File, folder: UploadFolder) {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const uploadsDir = path.join(process.cwd(), "public", "uploads", folder);
  await fs.mkdir(uploadsDir, { recursive: true });

  const extension = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const filename = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}.${extension}`;

  const filePath = path.join(uploadsDir, filename);
  await fs.writeFile(filePath, buffer);

  return `/uploads/${folder}/${filename}`;
}
