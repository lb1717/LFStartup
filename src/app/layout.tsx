import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Monventa",
  description: "Find your lost items on campus",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/images/monventa-logo.png" type="image/png" />
      </head>
      <body className={inter.className}>
        <Navigation />
        {children}
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
