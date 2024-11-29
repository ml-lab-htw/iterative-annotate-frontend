import type {Metadata, Viewport} from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CNN - SSD Playground",
  description: "Model training UI for SSD fine-tuning",
};

export const viewport: Viewport = {
  themeColor: '#ffffff',
  userScalable: false,
  width: "device-width",
  initialScale: 1,
  viewportFit: "auto",
  colorScheme: "light"
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={'scroll-smooth'}>
      <body className={`${inter.className} z-1`}>
      {children}
      </body>
    </html>
  );
}
