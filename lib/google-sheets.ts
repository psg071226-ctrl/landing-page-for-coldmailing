import { google } from "googleapis";

import type { WaitlistPayload } from "@/lib/waitlist-schema";

type WaitlistRow = WaitlistPayload & {
  source: string;
};

type DailyMetric = "unique_visits" | "cta_clicks" | "waitlist_conversions";

function getGoogleSheetsConfig() {
  const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY;
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  const sheetName = process.env.GOOGLE_SHEETS_SHEET_NAME;
  const dailyAnalyticsSheetName = process.env.GOOGLE_SHEETS_DAILY_ANALYTICS_SHEET_NAME;
  const dailyWaitlistSheetName = process.env.GOOGLE_SHEETS_DAILY_WAITLIST_SHEET_NAME;

  if (!clientEmail || !privateKey || !spreadsheetId || !sheetName) {
    throw new Error(
      "Google Sheets is not configured. Add the required environment variables before accepting waitlist submissions."
    );
  }

  return {
    clientEmail,
    privateKey: privateKey.replace(/\\n/g, "\n"),
    spreadsheetId,
    sheetName,
    dailyAnalyticsSheetName: dailyAnalyticsSheetName || "DailyAnalytics",
    dailyWaitlistSheetName: dailyWaitlistSheetName || "DailyWaitlist"
  };
}

async function getSheetsClient() {
  const { clientEmail, privateKey } = getGoogleSheetsConfig();

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: clientEmail,
      private_key: privateKey
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"]
  });

  return google.sheets({
    version: "v4",
    auth
  });
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

export async function appendWaitlistRow({
  company,
  role,
  email,
  source
}: WaitlistRow) {
  const { spreadsheetId, sheetName, dailyWaitlistSheetName } = getGoogleSheetsConfig();
  const sheets = await getSheetsClient();
  const submittedAt = new Date().toISOString();
  const dailyDate = getTodayDate();

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${sheetName}!A:E`,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [[company, role, email, submittedAt, source]]
    }
  });

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${dailyWaitlistSheetName}!A:F`,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [[dailyDate, company, role, email, submittedAt, source]]
    }
  });
}

export async function incrementDailyMetric(metric: DailyMetric) {
  const { spreadsheetId, dailyAnalyticsSheetName } = getGoogleSheetsConfig();
  const sheets = await getSheetsClient();
  const date = getTodayDate();

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${dailyAnalyticsSheetName}!A:E`
  });

  const rows = response.data.values ?? [];
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
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${dailyAnalyticsSheetName}!A${rowIndex + 1}:E${rowIndex + 1}`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values
      }
    });

    return;
  }

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${dailyAnalyticsSheetName}!A:E`,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values
    }
  });
}
