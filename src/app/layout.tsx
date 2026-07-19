import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const siteUrl = "https://tigerstrake.com";
const siteDescription =
  "Stanford AeroAstro student building rockets, UAVs, embedded systems, and fabrication-heavy hardware.";
const siteImage = {
  url: "/images/about-me/tiger-portrait-headshot.jpg",
  width: 2172,
  height: 1536,
  alt: "Portrait of Tiger Strake outdoors in the mountains",
};

const spaceGrotesk = localFont({
  src: "./fonts/space-grotesk-latin.woff2",
  variable: "--font-space-grotesk",
  weight: "300 700",
  display: "swap",
});

const inter = localFont({
  src: "./fonts/inter-latin.woff2",
  variable: "--font-inter",
  weight: "100 900",
  display: "swap",
});

const jetbrainsMono = localFont({
  src: "./fonts/jetbrains-mono-latin.woff2",
  variable: "--font-geist-mono",
  weight: "100 800",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Tiger Strake",
    template: "%s | Tiger Strake",
  },
  description: siteDescription,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Tiger Strake",
    title: "Tiger Strake",
    description: siteDescription,
    images: [siteImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tiger Strake",
    description: siteDescription,
    images: [siteImage.url],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Tiger Strake",
  url: siteUrl,
  image: `${siteUrl}${siteImage.url}`,
  email: "mailto:tiger29@stanford.edu",
  affiliation: {
    "@type": "CollegeOrUniversity",
    name: "Stanford University",
  },
  knowsAbout: [
    "aerospace engineering",
    "rocketry",
    "unmanned aerial vehicles",
    "embedded systems",
    "digital fabrication",
    "aviation",
  ],
  sameAs: [
    "https://github.com/tigerstrake",
    "https://www.linkedin.com/in/tiger-strake-8581582a1/",
    "https://www.instagram.com/tiger.strake/",
  ],
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
      <body className="min-h-screen flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
