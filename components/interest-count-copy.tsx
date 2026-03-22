"use client";

import { useInterestCount } from "@/components/use-interest-count";

export function InterestCountCopy() {
  const { interestCount } = useInterestCount();

  return <>{interestCount} users are already waiting.</>;
}
