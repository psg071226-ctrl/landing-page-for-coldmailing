import { SignJWT, importPKCS8 } from "jose";

import type { WaitlistPayload } from "@/lib/waitlist-schema";

type WaitlistRow = WaitlistPayload & {
  source: string;
};

type DailyMetric = "unique_visits" | "cta_clicks" | "waitlist_conversions";

type SheetsConfig = {
  clientEmail: string;
  privateKey: string;
  spreadsheetId: string;
  sheetName: string;
  dailyAnalyticsSheetName: string;
  dailyWaitlistSheetName: string;
  interestSheetName: string;
  ipHashSalt: string;
};

const BASE_INTEREST_COUNT = 50;
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_SHEETS_SCOPE = "https://www.googleapis.com/auth/spreadsheets";

function getGoogleSheetsConfig(): SheetsConfig {
  const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY;
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  const sheetName = process.env.GOOGLE_SHEETS_SHEET_NAME;
  const dailyAnalyticsSheetName = process.env.GOOGLE_SHEETS_DAILY_ANALYTICS_SHEET_NAME;
  const dailyWaitlistSheetName = process.env.GOOGLE_SHEETS_DAILY_WAITLIST_SHEET_NAME;
  const interestSheetName = process.env.GOOGLE_SHEETS_INTEREST_SHEET_NAME;
  const ipHashSalt = process.env.IP_HASH_SALT;

  if (!clientEmail || !privateKey || !spreadsheetId || !sheetName) {
    throw new Error(
      "Google Sheets is not configured. Add the required environment variables before accepting waitlist submissions."
    );
  }

  return {
    clientEmail,
    privateKey: normalizePrivateKey(privateKey),
    spreadsheetId,
    sheetName,
    dailyAnalyticsSheetName: dailyAnalyticsSheetName || "DailyAnalytics",
    dailyWaitlistSheetName: dailyWaitlistSheetName || "DailyWaitlist",
    interestSheetName: interestSheetName || "InterestCounter",
    ipHashSalt: ipHashSalt || "heimdall-default-salt"
  };
}

function normalizePrivateKey(privateKey: string) {
  return privateKey
    .trim()
    .replace(/^"+|"+$/g, "")
    .replace(/^'+|'+$/g, "")
    .replace(/\r/g, "")
    .replace(/\\n/g, "\n");
}

function getTodayDate() {
  return new Date().toISOString().slice(0, 10);
}

function parseMetricRow(row: string[] | undefined) {
  return {
    uniqueVisits: Number(row?.[1] || 0),
    ctaClicks: Number(row?.[2] || 0),
    waitlistConversions: Number(row?.[3] || 0)
  };
}

async function getAccessToken() {
  const { clientEmail, privateKey } = getGoogleSheetsConfig();
  const now = Math.floor(Date.now() / 1000);
  const key = await importPKCS8(privateKey, "RS256");
  const signedJwt = await new SignJWT({
    scope: GOOGLE_SHEETS_SCOPE
  })
    .setProtectedHeader({
      alg: "RS256",
      typ: "JWT"
    })
    .setIssuer(clientEmail)
    .setAudience(GOOGLE_TOKEN_URL)
    .setIssuedAt(now)
    .setExpirationTime(now + 3600)
    .sign(key);

  const response = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: signedJwt
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Google auth failed: ${errorText}`);
  }

  const data = (await response.json()) as {
    access_token?: string;
  };

  if (!data.access_token) {
    throw new Error("Google auth failed: access token missing.");
  }

  return data.access_token;
}

async function googleSheetsRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const accessToken = await getAccessToken();
  const response = await fetch(`https://sheets.googleapis.com/v4/${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      ...(init?.headers || {})
    }
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Google Sheets request failed: ${errorText}`);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return (await response.json()) as T;
}

async function getSheetValues(range: string) {
  const { spreadsheetId } = getGoogleSheetsConfig();
  const encodedRange = encodeURIComponent(range);

  const data = await googleSheetsRequest<{ values?: string[][] }>(
    `spreadsheets/${spreadsheetId}/values/${encodedRange}`
  );

  return data.values ?? [];
}

async function appendSheetValues(range: string, values: string[][]) {
  const { spreadsheetId } = getGoogleSheetsConfig();
  const encodedRange = encodeURIComponent(range);

  await googleSheetsRequest(
    `spreadsheets/${spreadsheetId}/values/${encodedRange}:append?valueInputOption=USER_ENTERED`,
    {
      method: "POST",
      body: JSON.stringify({
        values
      })
    }
  );
}

async function updateSheetValues(range: string, values: string[][]) {
  const { spreadsheetId } = getGoogleSheetsConfig();
  const encodedRange = encodeURIComponent(range);

  await googleSheetsRequest(
    `spreadsheets/${spreadsheetId}/values/${encodedRange}?valueInputOption=USER_ENTERED`,
    {
      method: "PUT",
      body: JSON.stringify({
        values
      })
    }
  );
}

async function hashIpAddress(ip: string) {
  const { ipHashSalt } = getGoogleSheetsConfig();
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(`${ipHashSalt}:${ip}`)
  );

  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export async function appendWaitlistRow({
  company,
  role,
  email,
  source
}: WaitlistRow) {
  const { sheetName, dailyWaitlistSheetName } = getGoogleSheetsConfig();
  const submittedAt = new Date().toISOString();
  const dailyDate = getTodayDate();

  await appendSheetValues(`${sheetName}!A:E`, [[company, role, email, submittedAt, source]]);
  await appendSheetValues(`${dailyWaitlistSheetName}!A:F`, [
    [dailyDate, company, role, email, submittedAt, source]
  ]);
}

export async function incrementDailyMetric(metric: DailyMetric) {
  const { dailyAnalyticsSheetName } = getGoogleSheetsConfig();
  const date = getTodayDate();
  const rows = await getSheetValues(`${dailyAnalyticsSheetName}!A:E`);
  const rowIndex = rows.findIndex((row) => row[0] === date);
  const existing = rowIndex >= 0 ? parseMetricRow(rows[rowIndex]) : parseMetricRow(undefined);

  const nextRow = {
    uniqueVisits: existing.uniqueVisits,
    ctaClicks: existing.ctaClicks,
    waitlistConversions: existing.waitlistConversions
  };

  if (metric === "unique_visits") {
    nextRow.uniqueVisits += 1;
  }

  if (metric === "cta_clicks") {
    nextRow.ctaClicks += 1;
  }

  if (metric === "waitlist_conversions") {
    nextRow.waitlistConversions += 1;
  }

  const values = [
    [
      date,
      String(nextRow.uniqueVisits),
      String(nextRow.ctaClicks),
      String(nextRow.waitlistConversions),
      new Date().toISOString()
    ]
  ];

  if (rowIndex >= 0) {
    await updateSheetValues(
      `${dailyAnalyticsSheetName}!A${rowIndex + 1}:E${rowIndex + 1}`,
      values
    );
    return;
  }

  await appendSheetValues(`${dailyAnalyticsSheetName}!A:E`, values);
}

export async function getInterestCounter(ip: string) {
  const { interestSheetName } = getGoogleSheetsConfig();
  const ipHash = await hashIpAddress(ip);
  const rows = await getSheetValues(`${interestSheetName}!A:C`);
  const alreadyCounted = rows.some((row) => row[1] === ipHash);

  return {
    count: BASE_INTEREST_COUNT + rows.length,
    alreadyCounted
  };
}

export async function registerInterestByIp(ip: string) {
  const { interestSheetName } = getGoogleSheetsConfig();
  const ipHash = await hashIpAddress(ip);
  const rows = await getSheetValues(`${interestSheetName}!A:C`);
  const alreadyCounted = rows.some((row) => row[1] === ipHash);

  if (!alreadyCounted) {
    await appendSheetValues(`${interestSheetName}!A:C`, [
      [getTodayDate(), ipHash, new Date().toISOString()]
    ]);
  }

  return {
    count: BASE_INTEREST_COUNT + rows.length + (alreadyCounted ? 0 : 1),
    alreadyCounted
  };
}
