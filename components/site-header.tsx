import { Icons } from '@/components/icons';
import { MainNav } from '@/components/main-nav';
import { siteConfig } from '@/config/site';
import { ConnectWallet, useAddress } from '@thirdweb-dev/react';
import Link from 'next/link';

export function SiteHeader() {
  const address = useAddress();

  return (
    <header className="sticky top-0 z-40 w-full bg-primary">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <MainNav items={siteConfig.mainNav} />
        <div className="hidden sm:block">
          <div className="flex flex-1 items-center justify-end space-x-4">
            <nav className="flex items-center space-x-1">
              <ConnectWallet theme="dark" btnTitle="Connect Wallet" />
              {address && (
                <Link href={`/profile/${address}`}>
                  <Icons.user className="h-8 w-8 fill-current" />
                </Link>
              )}
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
