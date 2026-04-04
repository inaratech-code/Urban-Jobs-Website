import type { Metadata, Viewport } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import WebAnalyticsTracker from "@/components/WebAnalyticsTracker";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: "#2561c2",
  colorScheme: "light",
};

export const metadata: Metadata = {
  title: "Urban Jobs – Job Portal in Dhangadhi",
  description:
    "Urban Jobs connects job seekers and employers in Dhangadhi, Nepal. Find teaching jobs, hotel management, reception, accounting, and IT roles. Post jobs and submit your resume.",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "Urban Jobs – Job Portal in Dhangadhi",
    description:
      "Connecting Talent with Opportunity. Find jobs and hire locally in Dhangadhi, Nepal.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className="font-sans antialiased min-h-screen min-h-[100dvh] bg-background overflow-x-clip pb-[env(safe-area-inset-bottom,0px)] pl-[env(safe-area-inset-left,0px)] pr-[env(safe-area-inset-right,0px)]">
        <WebAnalyticsTracker />
        {children}
      </body>
    </html>
  );
}
