import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/toast-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Factory Management System",
    template: "%s | Factory MRP",
  },
  description: "Complete factory management and MRP system with inventory, purchase orders, sales orders, and production planning",
  keywords: ["factory", "management", "MRP", "inventory", "production", "ERP"],
  authors: [{ name: "Factory MRP Team" }],
  creator: "Factory MRP",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://crmfurniture.vercel.app",
    title: "Factory Management System",
    description: "Complete factory management and MRP system",
    siteName: "Factory MRP",
  },
  twitter: {
    card: "summary_large_image",
    title: "Factory Management System",
    description: "Complete factory management and MRP system",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <ToastProvider />
      </body>
    </html>
  );
}
