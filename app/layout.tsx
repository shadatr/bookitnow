import type { Metadata } from "next";
import "./globals.css";
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "./Providers";


const inter = Poppins({style:"normal", weight:["200" , "300" , "400" , "500" ,"700", "800" ,"900"],subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BookItNow",
  description: "Vacation rental website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.className
        )}
      >
        <Providers>
        {children}
        <Toaster />
        </Providers>
      </body>
    </html>
  );
}
