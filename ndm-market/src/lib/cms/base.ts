import 'server-only';

import { mkdir, readFile, writeFile } from 'fs/promises';
import path from 'path';

const CMS_ROOT = path.join(process.cwd(), 'src', 'cms');

async function ensureCmsRoot() {
  await mkdir(CMS_ROOT, { recursive: true });
}

async function resolvePath(fileName: string) {
  await ensureCmsRoot();
  return path.join(CMS_ROOT, fileName);
}

export async function readJsonFile<T>(fileName: string, fallback: T): Promise<T> {
  const filePath = await resolvePath(fileName);

  try {
    const buffer = await readFile(filePath, 'utf-8');
    return JSON.parse(buffer) as T;
  } catch (error) {
    return fallback;
  }
}

export async function writeJsonFile<T>(fileName: string, data: T): Promise<void> {
  const filePath = await resolvePath(fileName);
  await writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

export async function mutateJsonFile<T>(fileName: string, fallback: T, mutator: (current: T) => Promise<T> | T): Promise<T> {
  const current = await readJsonFile<T>(fileName, fallback);
  const next = await mutator(current);
  await writeJsonFile(fileName, next);
  return next;
}

export function getTimestamp(): string {
  return new Date().toISOString();
}
