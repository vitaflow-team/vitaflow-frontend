import { Motion } from "@/components/layout/motion";
import type { Metadata } from "next";
import { Lato } from "next/font/google";
import "./globals.css";

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
});

export const metadata: Metadata = {
  title: "Vitaflow",
  description: "Vitaflow é uma plataforma de gerenciamento de saúde que permite aos usuários gerenciar suas saúde de forma fácil e eficiente.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${lato.variable} font-lato antialiased`}
      >
        <Motion>{children}</Motion>
      </body>
    </html>
  );
}
