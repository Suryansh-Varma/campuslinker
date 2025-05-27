import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Image from "next/image";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SkilLoop",
  description: "WE WANTED TO CREATE A APP WHICH WILL HELP COLLEGE STUDENTS TO SHOW CASE THEIR SKILLS AND ABLE TO TAKE THEIR HELP TO SOLVE OUR PROBLEMS",
};
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
      <ClerkProvider>
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <header className="flex justify-between items-center px-6 py-4 h-16 border-b shadow-sm bg-white">
            {/* Logo and Title */}
            <div className="flex items-center space-x-2">
              <Image
                src="/pics/logo.png" // Make sure this image exists in your /public folder
                alt="Skilloop Logo"
                width={32}
                height={32}
              />
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
  )
}