export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: 'PrimoSQL',
  description:
    'Buy, sell, and mint SQL queries as NFTs. Data powered by Chainbase.',
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
    twitter: 'https://twitter.com/primo_data',
    github: 'https://github.com/PrimoData/primo-sql',
  },
};
