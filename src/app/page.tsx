"use client";
import { SessionProvider } from "next-auth/react";
import Event from "./components/events"

export default function Home() {
  return (
    <SessionProvider>
      <Event />
    </SessionProvider>
  );
}