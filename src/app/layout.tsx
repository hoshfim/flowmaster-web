import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/lib/auth-context';
import { ToastProvider } from '@/components/ui/Toast';
import { ThemeProvider } from '@/lib/theme-context';

export const metadata: Metadata = {
  title: 'FlowMaster AI — Cashflow Intelligence for E-Commerce',
  description: 'Unified cashflow dashboard for Shopify, TikTok Shop, and more.',
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="fm-dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@300;400;500&family=DM+Sans:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
        {/* Prevent theme flash on load */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(){
                var t = localStorage.getItem('fm-theme');
                if (t) document.documentElement.setAttribute('data-theme', t);
              })();
            `,
          }}
        />
      </head>
      <body>
        <ThemeProvider>
          <AuthProvider>
            <ToastProvider>
              {children}
            </ToastProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
