import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Simulação de Antecipação de Precatório | Actum Precatórios",
  description:
    "Descubra em menos de 1 minuto se o seu precatório pode ser antecipado. Simulação gratuita, sem compromisso e protegida por LGPD.",
  robots: { index: false, follow: false },
  icons: { icon: "/logo-actum.png" },
};

export const viewport: Viewport = {
  themeColor: "#122036",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`h-full antialiased ${poppins.variable}`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
