"use client";

import { useEffect, useState } from "react";

type InterestSnapshot = {
  count: number;
  isLoading: boolean;
};

export const DEFAULT_INTEREST_COUNT = 50;

let count = DEFAULT_INTEREST_COUNT;
let isLoading = true;
let hasLoaded = false;
let pendingLoad: Promise<void> | null = null;

const listeners = new Set<(snapshot: InterestSnapshot) => void>();

function emitChange() {
  const snapshot = {
    count,
    isLoading
  };

  listeners.forEach((listener) => {
    listener(snapshot);
  });
}

async function loadInterestCount() {
  if (hasLoaded) {
    return;
  }

  if (pendingLoad) {
    await pendingLoad;
    return;
  }

  pendingLoad = (async () => {
    try {
      const response = await fetch("/api/interest", {
        method: "GET",
        cache: "no-store",
        credentials: "same-origin"
      });

      const data = (await response.json()) as {
        ok: boolean;
        count?: number;
      };

      if (response.ok && data.ok) {
        count = data.count ?? DEFAULT_INTEREST_COUNT;
      }
    } catch {
      // Keep the landing page usable even if the counter cannot load.
    } finally {
      isLoading = false;
      hasLoaded = true;
      pendingLoad = null;
      emitChange();
    }
  })();

  await pendingLoad;
}

export function updateInterestCount(nextCount: number) {
  count = nextCount;
  isLoading = false;
  hasLoaded = true;
  emitChange();
}

export function useInterestCount() {
  const [snapshot, setSnapshot] = useState<InterestSnapshot>({
    count,
    isLoading
  });

  useEffect(() => {
    listeners.add(setSnapshot);
    setSnapshot({ count, isLoading });
    void loadInterestCount();

    return () => {
      listeners.delete(setSnapshot);
    };
  }, []);

  return {
    interestCount: snapshot.count,
    isLoadingCount: snapshot.isLoading,
    updateInterestCount
  };
}
