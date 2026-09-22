import type { Metadata } from 'next';
import './globals.scss';

export const metadata: Metadata = {
  title: 'Hora do Descanso',
  description: 'Um ambiente sonoro tranquilo para momentos de relaxamento.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body>{children}</body></html>;
}
