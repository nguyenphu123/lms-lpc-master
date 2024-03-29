"use client";
import "./globals.css";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ToastProvider } from "@/components/providers/toaster-provider";
import { ConfettiProvider } from "@/components/providers/confetti-provider";
import * as Ably from "ably";
import { AblyProvider } from "ably/react";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { getFromStorage } from "@/components/ui/current-theme";
import { QueryClient, QueryClientProvider } from "react-query";

const client = new Ably.Realtime.Promise({ authUrl: "/api/notifications" });
const inter = Inter({ subsets: ["latin"] });
const queryClient = new QueryClient();
// export const metadata: Metadata = {
//   title: 'Create Next App',
//   description: 'Generated by create next app',
// }

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <AblyProvider client={client}>
        <html lang="en">
          <body className={inter.className}>
            <ThemeProvider
              attribute="class"
              defaultTheme={getFromStorage("theme") as string}
              enableSystem
              disableTransitionOnChange
              storageKey="theme"
            >
              <QueryClientProvider client={queryClient}>
                <ConfettiProvider />
                <ToastProvider />
                {children}
              </QueryClientProvider>
            </ThemeProvider>
          </body>
        </html>
      </AblyProvider>
    </ClerkProvider>
  );
}
