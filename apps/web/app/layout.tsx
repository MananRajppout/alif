"use client";
import localFont from "next/font/local";
import "./globals.css";
import "react-loading-skeleton/dist/skeleton.css"; // React Skeleton CSS
import ThemeProviderWrapper from "../src/components/ThemeProviderWrapper"; // Import your new client component
import ClientComponents from "@/src/components/ClientComponentsWrapper";
import { QueProvider } from "@/src/context/QueContent";

// Load local fonts
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Jost:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-body">
          <ThemeProviderWrapper>
            <ClientComponents>
              <QueProvider>
                    {children}
              </QueProvider>
              </ClientComponents>
          </ThemeProviderWrapper>
      </body>
    </html>
  );
}
