import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Script from "next/script";
import Analytics from "@/components/Analytics";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Monventa",
  description: "Find your lost items on campus",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light">
      <head>
        <meta name="color-scheme" content="light only" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/images/monventa-logo.png" type="image/png" />
        <Analytics />
      </head>
      <body className={inter.className}>
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-0 focus:left-0 focus:z-50 focus:p-4 focus:bg-white focus:text-blue-600">
          Skip to main content
        </a>
        <Navigation />
        <main id="main-content" className="min-h-screen">
          {children}
        </main>
        <Script id="clear-image-cache">
          {`
            // Force reload images with monventa in the filename
            document.addEventListener('DOMContentLoaded', () => {
              const images = document.querySelectorAll('img[src*="monventa"]');
              images.forEach(img => {
                const originalSrc = img.src;
                img.src = originalSrc + (originalSrc.includes('?') ? '&' : '?') + 'refresh=' + Date.now();
              });
            });
          `}
        </Script>
      </body>
    </html>
  );
}
