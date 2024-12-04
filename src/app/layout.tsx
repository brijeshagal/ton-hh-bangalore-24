import "@fontsource/vt323";
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "My Telegram Mini App",
  description: "A mini app for Telegram.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <TonConnectUIProvider manifestUrl="https://ton-hh-bangalore-24.vercel.app/tonconnect-manifest.json">
      <html lang="en">
        <body>{children}</body>
      </html>
    </TonConnectUIProvider>
  );
}
