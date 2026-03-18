"use client";

import { useEffect } from "react";

const VISIT_STORAGE_KEY = "heimdall-visit-tracked-date";

function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

export function AnalyticsTracker() {
  useEffect(() => {
    const todayKey = getTodayKey();
    const trackedDate = window.localStorage.getItem(VISIT_STORAGE_KEY);

    if (trackedDate === todayKey) {
      return;
    }

    window.localStorage.setItem(VISIT_STORAGE_KEY, todayKey);

    void fetch("/api/analytics", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        event: "visit"
      })
    });
  }, []);

  return null;
}
