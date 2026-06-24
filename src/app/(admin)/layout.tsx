import { Suspense } from "react"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { Titan_One, Poppins, Roboto_Mono } from "next/font/google"
import { cn } from "@/lib/utils"
import type { Metadata } from "next"
import Navbar from "@/components/navbar"
import "../globals.css"

const titanOne = Titan_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-heading",
})

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-sans",
})

const robotoMono = Roboto_Mono({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "Admin",
  description: "Admin Dashboard",
}

async function AuthGuard({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) {
    redirect("/login")
  }

  if (session.user?.role !== "admin") {
    redirect("/")
  }

  return <>{children}</>
}

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="th"
      className={cn(poppins.className, "font-sans", titanOne.variable, robotoMono.variable)}
    >
      <body>
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
          <Navbar />
          <AuthGuard>{children}</AuthGuard>
        </Suspense>
      </body>
    </html>
  )
}
