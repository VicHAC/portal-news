import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import prisma from "@/lib/prisma";

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
  // CAMBIO CLAVE: Ordenamos por 'order' ascendente (0, 1, 2...)
  const sections = await prisma.section.findMany({
    orderBy: { order: 'asc' }
  });

  return (
    <html lang="es">
      <body className={inter.className}>
        {/* Pasamos las secciones ordenadas al componente Navbar */}
        <Navbar sections={sections} />
        {children}
      </body>
    </html>
  );
}