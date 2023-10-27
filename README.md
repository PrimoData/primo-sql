# PrimoSQL

Marketplace to create, sell, and buy blockchain data SQL queries, powered by Chainbase.

- [Live App](https://primo-sql.vercel.app/)
- [Video Demo](https://youtu.be/JNm-zLGqZOg)

_Note: This project was completed as part of the [Chainbase x DeveloperDAO Hackathon](https://twitter.com/developer_dao/status/1713991958249550271) in October 2023._

## Purpose

PrimoSQL enables blockchain data analysts to own their SQL queries by storing them as NFTs, which can then be bought and sold with other analysts in the marketplace. The current problem in the blockchain analytics space is the platforms own the SQL queries analysts create and most queries are public by default. Chainbase is a natural fit to be the data provider for PrimoSQL because it keeps queries private by deafult.

## Stack

- [Chainbase](https://chainbase.com) - Blockchain data provider.
- [thirdweb](https://thirdweb.com/) - NFT & Marketplace contracts and [marketplace template](https://github.com/thirdweb-example/marketplace-v3).
- [Polygon](https://polygon.technology/) - Blockchain to store SQL query NFTs.
- [shadcn](https://ui.shadcn.com/) & [v0](https://v0.dev/) - UI components.
- [Next.js](https://nextjs.org/) - Frontend framework.

## Setup

Feel free to copy and edit into your own version, which you can do by forking/cloning this GitHub repo, then running the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Next, setup the environment variables in `.env.local`, using `.env.example` as a guide.

After that, open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Finally, deploy to [Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

## License

Licensed under the [MIT license](https://github.com/PrimoData/primo-sql/blob/main/LICENSE.md).
