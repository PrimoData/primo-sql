import type { NextPage } from 'next';
import Link from 'next/link';
import Image from 'next/image';

const Home: NextPage = () => {
  return (
    <div className="container mx-auto px-4 mt-36">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold text-center bg-clip-text text-blue-500">
          Own Your
          <br />
          Queries
        </h1>
        <p className="mt-4 text-center text-lg">
          PrimoSQL is a marketplace for SQL queries. You can buy and sell SQL
          queries as NFTs.
        </p>

        <div className="mt-8 flex justify-center">
          <Link
            className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
            href="/mint"
          >
            Mint SQL
          </Link>
          <Link
            className="px-4 py-2 ml-4 bg-blue-300 text-black rounded hover:bg-blue-400"
            href="/buy"
          >
            Buy SQL
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
