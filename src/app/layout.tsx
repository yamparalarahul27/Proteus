import type { Metadata } from "next";
import { Belanosima, Inter, Roboto, VT323 } from "next/font/google";
import { AgentationDevtools } from "@/components/AgentationDevtools";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const roboto = Roboto({
  subsets: ["latin"],
  variable: "--font-roboto",
  weight: ["400", "500", "700"],
});

const belanosima = Belanosima({
  subsets: ["latin"],
  variable: "--font-brand",
  weight: "400",
});

const pixel = VT323({
  subsets: ["latin"],
  variable: "--font-pixel",
  weight: "400",
});

export const metadata: Metadata = {
  title: "Proteus",
  description: "Proteus is a cross-chain DeFi dashboard.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${roboto.variable} ${belanosima.variable} ${pixel.variable} antialiased`}
      >
        {children}
        <AgentationDevtools />
      </body>
    </html>
  );
}
