// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AuthProvider from "./admin/components/AuthProvider";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Priscilla Celine Setiawan - Software Engineer & Product Manager",
  description:
    "Priscilla Celine Setiawan is a Software Engineer & Product Manager with experience in DevSecOps and system analysis.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">{children}</main>
            <Footer />
            <Analytics />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
