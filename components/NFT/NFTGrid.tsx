import NFT from './NFT';
import Spinner from '@/components/Spinner';
import type { NFT as NFTType } from '@thirdweb-dev/sdk';
import React from 'react';

type Props = {
  isLoading: boolean;
  data: NFTType[] | undefined;
  overrideOnclickBehavior?: (nft: NFTType) => void;
  emptyText?: string;
};

export default function NFTGrid({
  isLoading,
  data,
  emptyText = 'No NFTs found for this collection.',
}: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {isLoading ? (
        <>
          <h2>
            Loading NFTs...
            <Spinner />
          </h2>
        </>
      ) : data && data.length > 0 ? (
        data.map((nft) => <NFT nft={nft} />)
      ) : (
        <p>{emptyText}</p>
      )}
    </div>
  );
}
