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
};

const WAITLIST_HEADERS = ["company", "role", "email", "submitted_at", "source"] as const;
const DAILY_ANALYTICS_HEADERS = [
  "date (UTC)",
  "unique_visits (1 browser/day on homepage)",
  "cta_clicks (hero Join waitlist button)",
  "waitlist_conversions (successful form submit)",
  "updated_at"
] as const;
const LEGACY_DAILY_ANALYTICS_HEADERS = [
  "date",
  "unique_visits",
  "cta_clicks",
  "waitlist_conversions",
  "updated_at"
] as const;
const DAILY_WAITLIST_HEADERS = [
  "date (UTC)",
  "company",
  "role",
  "email",
  "submitted_at",
  "source"
] as const;
const LEGACY_DAILY_WAITLIST_HEADERS = [
  "date",
  "company",
  "role",
  "email",
  "submitted_at",
  "source"
] as const;
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_SHEETS_SCOPE = "https://www.googleapis.com/auth/spreadsheets";

function getGoogleSheetsConfig(): SheetsConfig {
  const clientEmail = normalizeEnvValue(process.env.GOOGLE_SHEETS_CLIENT_EMAIL);
  const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY;
  const spreadsheetId = normalizeEnvValue(process.env.GOOGLE_SHEETS_SPREADSHEET_ID);
  const sheetName = normalizeSheetName(process.env.GOOGLE_SHEETS_SHEET_NAME);
  const dailyAnalyticsSheetName = normalizeSheetName(
    process.env.GOOGLE_SHEETS_DAILY_ANALYTICS_SHEET_NAME
  );
  const dailyWaitlistSheetName = normalizeSheetName(
    process.env.GOOGLE_SHEETS_DAILY_WAITLIST_SHEET_NAME
  );

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
    dailyWaitlistSheetName: dailyWaitlistSheetName || "DailyWaitlist"
  };
}

function normalizeEnvValue(value: string | undefined) {
  return value?.trim().replace(/^"+|"+$/g, "").replace(/^'+|'+$/g, "");
}

function normalizePrivateKey(privateKey: string) {
  return privateKey
    .trim()
    .replace(/^"+|"+$/g, "")
    .replace(/^'+|'+$/g, "")
    .replace(/\r/g, "")
    .replace(/\\n/g, "\n");
}

function normalizeSheetName(value: string | undefined) {
  const normalizedValue = normalizeEnvValue(value);
  return normalizedValue?.replace(/\r/g, "").replace(/\n/g, "");
}

function toSheetRange(sheetName: string, range: string) {
  const escapedSheetName = sheetName.replace(/'/g, "''");
  return `'${escapedSheetName}'!${range}`;
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

function getColumnLetter(columnNumber: number) {
  let value = columnNumber;
  let result = "";

  while (value > 0) {
    const remainder = (value - 1) % 26;
    result = String.fromCharCode(65 + remainder) + result;
    value = Math.floor((value - 1) / 26);
  }

  return result;
}

function isHeaderRow(firstRow: string[], headers: readonly string[]) {
  return headers.every((header, index) => firstRow[index] === header);
}

function matchesAnyHeaderRow(
  firstRow: string[],
  acceptedHeaderRows: readonly (readonly string[])[]
) {
  return acceptedHeaderRows.some((headers) => isHeaderRow(firstRow, headers));
}

function stripLeadingHeaderRow(
  rows: string[][],
  acceptedHeaderRows: readonly (readonly string[])[]
) {
  if (rows.length === 0) {
    return rows;
  }

  return matchesAnyHeaderRow(rows[0], acceptedHeaderRows) ? rows.slice(1) : rows;
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

async function batchUpdateSpreadsheet(requests: Record<string, unknown>[]) {
  const { spreadsheetId } = getGoogleSheetsConfig();

  await googleSheetsRequest(`spreadsheets/${spreadsheetId}:batchUpdate`, {
    method: "POST",
    body: JSON.stringify({
      requests
    })
  });
}

async function getSheetIdByName(spreadsheetId: string, sheetName: string) {
  const data = await googleSheetsRequest<{
    sheets?: Array<{
      properties?: {
        sheetId?: number;
        title?: string;
      };
    }>;
  }>(`spreadsheets/${spreadsheetId}?fields=sheets.properties(sheetId,title)`);

  const sheet = data.sheets?.find((entry) => entry.properties?.title === sheetName);
  const sheetId = sheet?.properties?.sheetId;

  if (sheetId === undefined) {
    throw new Error(`Sheet "${sheetName}" was not found in the configured spreadsheet.`);
  }

  return sheetId;
}

async function ensureSheetHeaders(
  spreadsheetId: string,
  sheetName: string,
  headers: readonly string[],
  acceptedHeaderRows: readonly (readonly string[])[] = [headers]
) {
  const firstRow = (await getSheetValues(toSheetRange(sheetName, "1:1")))[0] ?? [];
  const headerRange = toSheetRange(sheetName, `A1:${getColumnLetter(headers.length)}1`);
  const headerValues = [Array.from(headers)];

  if (matchesAnyHeaderRow(firstRow, acceptedHeaderRows)) {
    if (isHeaderRow(firstRow, headers)) {
      return;
    }

    await updateSheetValues(headerRange, headerValues);
    return;
  }

  if (firstRow.length === 0) {
    await updateSheetValues(headerRange, headerValues);
    return;
  }

  const sheetId = await getSheetIdByName(spreadsheetId, sheetName);

  await batchUpdateSpreadsheet([
    {
      insertDimension: {
        range: {
          sheetId,
          dimension: "ROWS",
          startIndex: 0,
          endIndex: 1
        },
        inheritFromBefore: false
      }
    }
  ]);

  await updateSheetValues(headerRange, headerValues);
}

async function ensureWaitlistSheetHeaders(
  spreadsheetId: string,
  sheetName: string,
  dailyWaitlistSheetName: string
) {
  await ensureSheetHeaders(spreadsheetId, sheetName, WAITLIST_HEADERS);
  await ensureSheetHeaders(spreadsheetId, dailyWaitlistSheetName, DAILY_WAITLIST_HEADERS, [
    DAILY_WAITLIST_HEADERS,
    LEGACY_DAILY_WAITLIST_HEADERS
  ]);
}

async function ensureAnalyticsSheetHeaders(
  spreadsheetId: string,
  dailyAnalyticsSheetName: string
) {
  await ensureSheetHeaders(
    spreadsheetId,
    dailyAnalyticsSheetName,
    DAILY_ANALYTICS_HEADERS,
    [DAILY_ANALYTICS_HEADERS, LEGACY_DAILY_ANALYTICS_HEADERS]
  );
}

export async function ensureConfiguredSheetHeaders() {
  const {
    spreadsheetId,
    sheetName,
    dailyAnalyticsSheetName,
    dailyWaitlistSheetName
  } = getGoogleSheetsConfig();

  await ensureWaitlistSheetHeaders(spreadsheetId, sheetName, dailyWaitlistSheetName);
  await ensureAnalyticsSheetHeaders(spreadsheetId, dailyAnalyticsSheetName);

  return [sheetName, dailyAnalyticsSheetName, dailyWaitlistSheetName] as const;
}

export async function appendWaitlistRow({
  company,
  role,
  email,
  source
}: WaitlistRow) {
  const { spreadsheetId, sheetName, dailyWaitlistSheetName } = getGoogleSheetsConfig();
  const submittedAt = new Date().toISOString();
  const dailyDate = getTodayDate();

  await ensureWaitlistSheetHeaders(spreadsheetId, sheetName, dailyWaitlistSheetName);
  await appendSheetValues(toSheetRange(sheetName, "A:E"), [
    [company, role, email, submittedAt, source]
  ]);
  await appendSheetValues(toSheetRange(dailyWaitlistSheetName, "A:F"), [
    [dailyDate, company, role, email, submittedAt, source]
  ]);
}

export async function incrementDailyMetric(metric: DailyMetric) {
  const { spreadsheetId, dailyAnalyticsSheetName } = getGoogleSheetsConfig();
  const date = getTodayDate();

  await ensureAnalyticsSheetHeaders(spreadsheetId, dailyAnalyticsSheetName);
  const rows = await getSheetValues(toSheetRange(dailyAnalyticsSheetName, "A:E"));
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
    await updateSheetValues(toSheetRange(dailyAnalyticsSheetName, `A${rowIndex + 1}:E${rowIndex + 1}`), values);
    return;
  }

  await appendSheetValues(toSheetRange(dailyAnalyticsSheetName, "A:E"), values);
}

