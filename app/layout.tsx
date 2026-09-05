import type {Metadata} from 'next';
import { Prompt, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const prompt = Prompt({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['thai', 'latin'],
  variable: '--font-prompt',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  weight: ['300', '400', '500', '600', '700', '800'],
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ZYRQUEN Ω∞ Prime v1.0 LTS',
  description: 'Authoritative Multiverse Sovereign Architecture System (Frozen v1.2 LTS) featuring Phase 01–40, 14,902 Canonical Seals, 18 Chambers (00–17), 17 Canonical Modules, and 10/10 REAL_HSM Consensus.',
  openGraph: {
    title: 'ZYRQUEN Ω∞ Prime v1.0 LTS',
    description: 'Authoritative Multiverse Sovereign Architecture System (Frozen v1.2 LTS) featuring Phase 01–40, 14,902 Canonical Seals, 18 Chambers (00–17), 17 Canonical Modules, and 10/10 REAL_HSM Consensus.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ZYRQUEN Ω∞ Prime v1.0 LTS',
    description: 'Authoritative Multiverse Sovereign Architecture System (Frozen v1.2 LTS) featuring Phase 01–40, 14,902 Canonical Seals, 18 Chambers (00–17), 17 Canonical Modules, and 10/10 REAL_HSM Consensus.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="th" className={`dark ${prompt.variable} ${jetbrainsMono.variable}`}>
      <body className={`min-h-screen bg-[#060913] text-slate-100 font-sans antialiased overflow-x-hidden selection:bg-[#67E8F9]/30 ${prompt.className}`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}


