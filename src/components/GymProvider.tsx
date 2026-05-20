"use client";

import { createContext, useContext } from "react";

export type GymConfig = {
  gymName: string;
  tagline: string;
  currency: string;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
};

const GymContext = createContext<GymConfig>({
  gymName: "Fitness Garage",
  tagline: "Gym Management",
  currency: "INR",
});

export function GymProvider({
  children,
  config,
}: {
  children: React.ReactNode;
  config: GymConfig;
}) {
  return <GymContext.Provider value={config}>{children}</GymContext.Provider>;
}

export function useGym() {
  return useContext(GymContext);
}
