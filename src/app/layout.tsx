import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/toast-provider";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
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
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased`}>
        <ThemeProvider>
          {children}
          <ToastProvider />
        </ThemeProvider>
      </body>
    </html>
  );
}
