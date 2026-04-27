import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Tiger Strake",
    template: "%s | Tiger Strake",
  },
  description:
    "Building rockets and UAVs at Stanford. Two pilot licenses, one very busy 3D printer.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://tigerstrake.com",
    siteName: "Tiger Strake",
    title: "Tiger Strake",
    description:
      "Building rockets and UAVs at Stanford. Two pilot licenses, one very busy 3D printer.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tiger Strake",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen flex flex-col">{children}</body>
    </html>
  );
}
