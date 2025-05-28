import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Image from "next/image";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { syncUserToSupabase } from "@/lib/syncUserToSupabase"; // ✅ new import

// Fonts
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SkilLoop",
  description:
    "We wanted to create an app to help college students showcase their skills and collaborate on solving real problems.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (userId) {
    await syncUserToSupabase(userId); // ✅ clean and modular
  }

  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <header className="flex justify-between items-center px-6 py-4 h-16 border-b shadow-sm bg-white">
            {/* Logo and Title */}
            <div className="flex items-center space-x-2">
              <Image src="/pics/logo.png" alt="SkilLoop Logo" width={32} height={32} />
              <span className="font-semibold text-lg text-gray-900">SkilLoop</span>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-4">
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="text-sm text-blue-600 hover:underline">Sign in</button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="text-sm text-blue-600 hover:underline">Sign up</button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
            </div>
          </header>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
