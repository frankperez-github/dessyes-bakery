import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_NAME,
  description: "Website made by criollos.tech",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body >{children}</body>
    </html>
  );
}
