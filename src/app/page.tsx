"use client";
import { SessionProvider } from "next-auth/react";
import Event from "./components/event"

export default function Home(){
  <SessionProvider>
   <Event />
  </SessionProvider>
}