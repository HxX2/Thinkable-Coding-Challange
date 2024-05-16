"use client";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import FormPage from "./form";
import { Toaster } from "@/components/ui/toaster";

export default async function RegisterPage() {
  return (
    <section className="h-screen flex items-center justify-center">
      <Toaster />
      <FormPage />
    </section>
  );
}
