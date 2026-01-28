import { Inter } from "next/font/google";
import { GameProvider } from "@/contexts/GameContext";
import "./globals.css";
import { Metadata } from 'next';
import GameEventsInitializer from "@/components/GameEventsInitializer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Guess Who? Challenge",
  description: "The live dashboard for the Guess Who? programming challenge.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <GameProvider>
          <GameEventsInitializer />
          {children}
        </GameProvider>
      </body>
    </html>
  );
}
