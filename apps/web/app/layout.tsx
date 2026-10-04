import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://cracksde.com"),
  title: {
    default: "CracksDE — Practice / Improve / Crack",
    template: "%s | CracksDE",
  },
  description:
    "Production-ready personalized roadmap, day-by-day study sprints, and practice engine for Software Engineering preparation.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/cracksde_logo.png", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    title: "CracksDE — Practice / Improve / Crack",
    description:
      "Production-ready personalized roadmap, day-by-day study sprints, and practice engine for Software Engineering preparation.",
    url: "https://cracksde.com",
    siteName: "CracksDE",
    images: [
      {
        url: "/cracksde-banner.png",
        width: 1024,
        height: 341,
        alt: "CracksDE — Practice / Improve / Crack",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CracksDE — Practice / Improve / Crack",
    description:
      "Production-ready personalized roadmap, day-by-day study sprints, and practice engine for Software Engineering preparation.",
    images: ["/cracksde-banner.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased bg-zinc-950 text-zinc-100`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
