import { Geist_Mono, Inter } from "next/font/google"
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { TooltipProvider } from "@/components/ui/tooltip"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils";

const inter = Inter({subsets:['latin'],variable:'--font-sans'})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", inter.variable)}
    >
      <body>
        {/* <ThemeProvider> */}
          <TooltipProvider>
            <NuqsAdapter>
              {children}
            </NuqsAdapter>
          </TooltipProvider>
        {/* </ThemeProvider> */}
      </body>
    </html>
  )
}
