import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/config/siteConfig";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: [
    {
      url: "../assets/images/logo.svg",
      href: "../assets/images/logo.svg",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen h-full bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        {children}
      </body>
    </html>
  );
}
