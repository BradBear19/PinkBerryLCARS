// app/layout.tsx
import "../public/globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PINK INC LCARS",
  description: "LCARS system"
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
