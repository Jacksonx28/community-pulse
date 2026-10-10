import type { Metadata } from "next";
import "./globals.css";
import SupportChat from "./support-chat";
import InteractionEffects from "./interaction-effects";
import { AppearanceProvider } from "./theme-controls";

export const metadata: Metadata = {
  title: "Community Pulse · Web3 collaborations",
  description: "Find community representatives and manage collaboration requests.",
  icons: {
    icon: "/favicon.svg?v=cp-logo-2",
    shortcut: "/favicon.svg?v=cp-logo-2",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased"><AppearanceProvider><InteractionEffects/>{children}<SupportChat/></AppearanceProvider></body>
    </html>
  );
}
