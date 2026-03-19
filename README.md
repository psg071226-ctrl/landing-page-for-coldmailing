# Project Heimdall Landing Page

This is a Vercel-friendly Next.js landing page for Project Heimdall with a dedicated waitlist form, Google Sheets lead capture, and daily Google Sheets analytics.

## Run locally

1. Install dependencies:

```bash
npm install
```

2. Copy `.env.example` to `.env.local` and fill in the Google Sheets credentials.

3. Start the app:

```bash
npm run dev
```

## Google Sheets setup

1. Create a Google Cloud service account with access to the Google Sheets API.
2. Share your target spreadsheet with the service account email.
3. Create three sheet tabs, for example `Waitlist`, `DailyAnalytics`, and `DailyWaitlist`.
   Add a fourth tab named `InterestCounter`.
4. Set these environment variables:

```bash
GOOGLE_SHEETS_CLIENT_EMAIL=
GOOGLE_SHEETS_PRIVATE_KEY=
GOOGLE_SHEETS_SPREADSHEET_ID=
GOOGLE_SHEETS_SHEET_NAME=
GOOGLE_SHEETS_DAILY_ANALYTICS_SHEET_NAME=
GOOGLE_SHEETS_DAILY_WAITLIST_SHEET_NAME=
GOOGLE_SHEETS_INTEREST_SHEET_NAME=
IP_HASH_SALT=
```

5. If you want to write or refresh the header row immediately, run:

```bash
npm run sync-sheet-headers
```

## Suggested sheet columns

Use the following column order in the main waitlist sheet:

1. `company`
2. `role`
3. `email`
4. `submitted_at`
5. `source`

Use the following column order in the daily analytics sheet:

1. `date (UTC)`
2. `unique_visits (1 browser/day on homepage)`
3. `cta_clicks (hero Join waitlist button)`
4. `waitlist_conversions (successful form submit)`
5. `updated_at`

Use the following column order in the daily waitlist sheet:

1. `date (UTC)`
2. `company`
3. `role`
4. `email`
5. `submitted_at`
6. `source`

Use the following column order in the interest counter sheet:

1. `date (UTC)`
2. `ip_hash (salted SHA-256)`
3. `counted_at`

## Notes

- The landing page CTA interest counter starts at `50`.
- Clicking `Join waitlist` increments the visible counter only once per IP address and then routes to `/waitlist`.
- The homepage records one visit per browser per day using local storage and appends that to daily analytics.
- CTA clicks are counted in the daily analytics sheet when users press `Join waitlist` on the landing page.
- Successful form submissions are appended to Google Sheets through `/api/waitlist` and also recorded in the daily waitlist sheet.
- The app now inserts a header row at the top of each Google Sheet automatically if one is missing.
