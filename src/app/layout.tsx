import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import prisma from "@/lib/prisma"; // <--- Importamos Prisma

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mi Portal de Noticias",
  description: "Noticias al día",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // CONSULTA A LA DB: Obtenemos las secciones reales
  const sections = await prisma.section.findMany({
    orderBy: { name: 'asc' }
  });

  return (
    <html lang="es">
      <body className={inter.className}>
        {/* Pasamos las secciones al Navbar */}
        <Navbar sections={sections} />
        {children}
      </body>
    </html>
  );
}