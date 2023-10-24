import { Navbar } from '../components/Navbar/Navbar';
// import NextNProgress from "nextjs-progressbar";
import { NETWORK } from '../const/contractAddresses';
import { ThirdwebProvider } from '@thirdweb-dev/react';
import type { AppProps } from 'next/app';
import '../styles/globals.css';
import { SiteHeader } from '@/components/site-header';
import { ThemeProvider } from '@/components/theme-provider';
import { fontSans } from '@/lib/fonts';
import { cn } from '@/lib/utils';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThirdwebProvider
      clientId={process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID}
      activeChain={NETWORK}
    >
      {/* Progress bar when navigating between pages */}
      {/* <NextNProgress
        color="var(--color-tertiary)"
        startPosition={0.3}
        stopDelayMs={200}
        height={3}
        showOnShallow={true}
      /> */}

      {/* Render the navigation menu above each component */}
      {/* <Navbar /> */}
      {/* Render the actual component (page) */}

      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <div
          className={cn(
            'min-h-screen bg-background font-sans antialiased',
            fontSans.variable
          )}
        >
          <SiteHeader />
          <div className="flex-1">
            {' '}
            <Component {...pageProps} />
          </div>
        </div>
      </ThemeProvider>
    </ThirdwebProvider>
  );
}

export default MyApp;
