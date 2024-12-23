'use client';

import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4">
      <SignIn
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "bg-white shadow-lg rounded-lg",
            headerTitle: "font-crimson text-2xl",
            headerSubtitle: "font-geist",
            formButtonPrimary: "bg-blue-600 hover:bg-blue-700 font-geist",
          }
        }}
      />
    </main>
  );
} 