import type { Metadata } from 'next';
import { Itim } from "next/font/google";
import './globals.scss';

const itim = Itim({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-itim",
});

export const metadata: Metadata = {
  title: 'Hora do Descanso',
  description: 'Um ambiente sonoro tranquilo para momentos de relaxamento.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR" className={itim.variable}><body>{children}</body></html>;
}
