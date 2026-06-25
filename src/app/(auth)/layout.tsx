import type { Metadata } from "next";
import { Lora, Prompt, Roboto_Mono } from "next/font/google";
import { cn } from "@/lib/utils";
import "../globals.css";

const lora = Lora({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-heading",
});

const prompt = Prompt({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["thai", "latin"],
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
      className={cn(prompt.className, "font-sans", lora.variable, robotoMono.variable)}
    >
      <body>
        {children}
      </body>
    </html>
  );
}
