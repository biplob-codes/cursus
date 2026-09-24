import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Geist_Mono, Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Cursus",
  description: "Your daily practice, tracked.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${geistMono.variable} antialiased h-full`}
      suppressHydrationWarning
    >
      <body className="min-h-full font-sans bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
