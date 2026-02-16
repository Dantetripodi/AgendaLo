import { Inter, Manrope } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata = {
  title: "Elite Cuts - Reserva Premium",
  description: "BarberBook: Sistema de gestión de turnos para Barbería Elite Cuts",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
        />
      </head>
      <body
        className={`${inter.variable} ${manrope.variable} antialiased bg-[#201d12] text-[#f8f7f6] min-h-screen font-[family-name:var(--font-manrope)]`}
      >
        {children}
      </body>
    </html>
  );
}
