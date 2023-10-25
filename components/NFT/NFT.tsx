import {
  MARKETPLACE_ADDRESS,
  NFT_COLLECTION_ADDRESS,
} from '../../const/contractAddresses';
import Spinner from '@/components/Spinner';
import { buttonVariants } from '@/components/ui/button';
import { CardContent, Card } from '@/components/ui/card';
import {
  ThirdwebNftMedia,
  useContract,
  useValidDirectListings,
  useValidEnglishAuctions,
} from '@thirdweb-dev/react';
import { NFT } from '@thirdweb-dev/sdk';
import Link from 'next/link';
import React from 'react';

type Props = {
  nft: NFT;
};

export default function NFTComponent({ nft }: Props) {
  const { contract: marketplace, isLoading: loadingContract } = useContract(
    MARKETPLACE_ADDRESS,
    'marketplace-v3'
  );

  // 1. Load if the NFT is for direct listing
  const { data: directListing, isLoading: loadingDirect } =
    useValidDirectListings(marketplace, {
      tokenContract: NFT_COLLECTION_ADDRESS,
      tokenId: nft.metadata.id,
    });

  // 2. Load if the NFT is for auction
  const { data: auctionListing, isLoading: loadingAuction } =
    useValidEnglishAuctions(marketplace, {
      tokenContract: NFT_COLLECTION_ADDRESS,
      tokenId: nft.metadata.id,
    });

  return (
    <Card
      key="1"
      className="rounded-lg overflow-hidden shadow-lg max-w-sm hover:shadow-xl transition-all duration-200 m-2"
    >
      <CardContent className="p-4">
        <ThirdwebNftMedia
          metadata={nft.metadata}
          className=""
          style={{ height: '215px' }}
        />
        <h2 className="text-xl font-bold hover:text-gray-700 transition-all duration-200 mt-2">
          {nft.metadata.name}
        </h2>
        <h3 className="text-gray-500 hover:text-gray-600 transition-all duration-200">
          Token ID #{nft.metadata.id}
        </h3>
        {loadingContract || loadingDirect || loadingAuction ? (
          <>
            <p className=" text-gray-600">Loading pricing information...</p>
            <Spinner />
          </>
        ) : directListing && directListing[0] ? (
          <div className="">
            <div>
              <p className="">
                {`${directListing[0]?.currencyValuePerToken.displayValue}
          ${directListing[0]?.currencyValuePerToken.symbol}`}
              </p>
            </div>
          </div>
        ) : auctionListing && auctionListing[0] ? (
          <div className="">
            <div>
              <p className="">Minimum Bid</p>
              <p className="">
                {`${auctionListing[0]?.minimumBidCurrencyValue.displayValue}
          ${auctionListing[0]?.minimumBidCurrencyValue.symbol}`}
              </p>
            </div>
          </div>
        ) : (
          <div className="">
            <div>
              <p className="">Not for sale</p>
            </div>
          </div>
        )}
        <div className="flex mt-4 space-x-2">
          <Link
            href={`/token/${NFT_COLLECTION_ADDRESS}/${nft.metadata.id}`}
            className={`${buttonVariants()} w-full`}
          >
            View
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
