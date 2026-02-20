import type { Metadata } from "next";
import { Nunito, Amatic_SC } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const amaticSc = Amatic_SC({
  variable: "--font-amatic",
  subsets: ["latin"],
  weight: ["700"],
});

export const metadata: Metadata = {
  title: "Project Gravity | Interactive 3D Portfolio",
  description: "인터랙티브 3D 포트폴리오 - 3D 월드를 탐험하며 저를 알아가세요!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${nunito.variable} ${amaticSc.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
