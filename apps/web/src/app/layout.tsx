import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { getLocale } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';
import { SessionProvider } from "@/components/providers/session-provider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.AUTH_URL || "https://www.youragencytoday.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "YourAgencyToday",
    template: "%s | YourAgencyToday",
  },
  description: "Planifica tu próximo viaje con YourAgencyToday",
  openGraph: {
    title: "YourAgencyToday",
    description: "Planifica tu próximo viaje con YourAgencyToday",
    url: "/",
    siteName: "YourAgencyToday",
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "YourAgencyToday",
    description: "Planifica tu próximo viaje con YourAgencyToday",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="h-full">
        <NextIntlClientProvider>
          <SessionProvider>{children}</SessionProvider>
          <Toaster position="bottom-right" />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
