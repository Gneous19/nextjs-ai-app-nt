import type { Metadata } from "next";
import { Titan_One, Poppins, Roboto_Mono } from "next/font/google";
import { cn } from "@/lib/utils";
import "../globals.css";

const titanOne = Titan_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-heading",
});

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-sans",
});

const robotoMono = Roboto_Mono({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "ระบบ ล็อกอิน",
  description: "เรียนรู้การเขียน Nex.tjs",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="th"
      className={cn(poppins.className, "font-sans", titanOne.variable, robotoMono.variable)}
    >
      <body>
        {children}
      </body>
    </html>
  );
}
