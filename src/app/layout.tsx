import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import prisma from "@/lib/prisma";
import NavbarVisibility from "@/components/NavbarVisibility";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mi Portal de Noticias",
  description: "Noticias al día",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-gray-50 min-h-screen flex flex-col">

        {/* ENVUELVE EL NAVBAR AQUÍ */}
        <NavbarVisibility>
          <Navbar />
        </NavbarVisibility>

        {children}

      </body>
    </html>
  );
}