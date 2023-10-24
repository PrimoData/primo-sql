export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: 'Next.js',
  description:
    'Beautifully designed components built with Radix UI and Tailwind CSS.',
  mainNav: [
    {
      title: 'Buy',
      href: '/buy',
    },
    {
      title: 'Sell',
      href: '/sell',
    },
    {
      title: 'Mint',
      href: '/mint',
    },
  ],
  links: {
    twitter: 'https://twitter.com/shadcn',
    github: 'https://github.com/shadcn/ui',
    docs: 'https://ui.shadcn.com',
  },
};
