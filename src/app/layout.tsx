'use client';

import { Inter } from "next/font/google";
import { GameProvider } from "@/contexts/GameContext";
import { useGameEvents } from "@/hooks/useGameEvents";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

// Metadata would need to be handled differently for client components if needed
// export const metadata: Metadata = {
//   title: "Guess Who? Challenge",
//   description: "The live dashboard for the Guess Who? programming challenge.",
// };

function GameLayout({ children }: { children: React.ReactNode }) {
  // This hook will now be active for the entire application lifecycle
  useGameEvents();

  return <>{children}</>;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <GameProvider>
          <GameLayout>{children}</GameLayout>
        </GameProvider>
      </body>
    </html>
  );
}
