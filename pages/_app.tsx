import { NETWORK } from '../const/contractAddresses';
import { ThirdwebProvider } from '@thirdweb-dev/react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import '../styles/globals.css';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { ThemeProvider } from '@/components/theme-provider';
import { fontSans } from '@/lib/fonts';
import { cn } from '@/lib/utils';
import { Analytics } from '@vercel/analytics/react';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThirdwebProvider
      clientId={process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID}
      activeChain={NETWORK}
    >
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
        <div
          className={cn(
            'min-h-screen bg-background font-sans antialiased',
            fontSans.variable
          )}
        >
          <Head>
            <title>PrimoSQL</title>
            <link rel="icon" href="/favicon.png" />
          </Head>
          <SiteHeader />
          <div className="flex-1">
            {' '}
            <Component {...pageProps} />
          </div>
          <SiteFooter />
          <Analytics />
        </div>
      </ThemeProvider>
    </ThirdwebProvider>
  );
}

export default MyApp;
