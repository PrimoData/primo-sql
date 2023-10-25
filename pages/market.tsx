import NFTGrid from '@/components/NFT/NFTGrid';
import { NFT_COLLECTION_ADDRESS } from '@/const/contractAddresses';
import { useContract, useNFTs } from '@thirdweb-dev/react';
import React from 'react';

export default function Buy() {
  // Load all of the NFTs from the NFT Collection
  const { contract } = useContract(NFT_COLLECTION_ADDRESS);
  const { data, isLoading } = useNFTs(contract);

  return (
    <div className="container">
      <h1 className="text-3xl font-bold sm:text-5xl xl:text-6xl/none my-4 text-center">
        Marketplace
      </h1>
      <p className="text-lg text-center pb-4 text-gray-700">
        Buy, sell, and mint SQL queries as NFTs. Data powered by Chainbase.
      </p>
      <NFTGrid
        data={data}
        isLoading={isLoading}
        emptyText={
          'Looks like there are no NFTs in this collection. Try minting one!'
        }
      />
    </div>
  );
}
