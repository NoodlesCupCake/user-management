import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import Navbar from "@/components/Navbar";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "UserHub — User Management",
  description:
    "A modern user management dashboard built with Next.js, PocketBase, and TanStack Query",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} antialiased`}>
        <Providers>
          <div className="flex min-h-screen flex-col bg-gray-950">
            <Navbar />
            <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-8">
              {children}
            </main>
            <footer className="border-t border-white/5 py-6 text-center text-sm text-gray-600">
              UserHub &copy; {new Date().getFullYear()} — Built with Next.js,
              PocketBase &amp; TanStack Query
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
