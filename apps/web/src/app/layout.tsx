import type { Metadata } from "next";
import { Piazzolla, Archivo, Courier_Prime } from "next/font/google";
import { getLocale } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';
import { SessionProvider } from "@/components/providers/session-provider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const heading = Piazzolla({
  variable: "--font-heading",
  subsets: ["latin"],
});

const body = Archivo({
  variable: "--font-body",
  subsets: ["latin"],
});

const postmark = Courier_Prime({
  variable: "--font-postmark",
  weight: ["400", "700"],
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
      className={`${heading.variable} ${body.variable} ${postmark.variable} h-full antialiased`}
    >
      <body className="h-full">
        {/*
          THESIS: chat isn't a bot window, it's writing home about a trip about
          to happen — every exchange composes toward a real keepsake, refusing
          the sterile-assistant-chat default and the OTA beach-photo default.
          OWN-WORLD: kraft/cream ground, ink type, airmail red+blue stripe as
          the one recurring accent (borders/stamps only, never a wash);
          Piazzolla display serif for voice, Archivo for UI, Courier Prime for
          postmark/metadata labels.
          STORY: a traveler describes a trip in chat and believes, within
          seconds, that a real person will finish what the AI starts.
          FIRST VIEWPORT: an oversized postal composition — serif headline on
          kraft paper, the chat input set as the postcard's message lines, one
          stamp-corner CTA. No stock hero photo.
          FORM: postal / correo aéreo, position 5 of 7 in the grounded list
          derived from the traveler's own world; seed key a3213872.
          FINISH: unreviewed and undocumented is unfinished; this build ends
          with the finish review, the verdict, and DESIGN.md.
        */}
        <NextIntlClientProvider>
          <SessionProvider>{children}</SessionProvider>
          <Toaster position="bottom-right" />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
