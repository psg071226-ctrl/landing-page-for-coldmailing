import process from "node:process";
import { pathToFileURL } from "node:url";

import nextEnv from "@next/env";

import { ensureConfiguredSheetHeaders } from "../lib/google-sheets.ts";

const { loadEnvConfig } = nextEnv;

export async function syncGoogleSheetHeaders() {
  loadEnvConfig(process.cwd());

  const sheetNames = await ensureConfiguredSheetHeaders();
  console.log(`Synced Google Sheets headers: ${sheetNames.join(", ")}`);
}

async function main() {
  try {
    await syncGoogleSheetHeaders();
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error while syncing Google Sheets headers.";

    console.error(`Failed to sync Google Sheets headers: ${message}`);
    process.exitCode = 1;
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}
