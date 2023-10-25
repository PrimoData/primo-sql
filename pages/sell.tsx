import { NFT_COLLECTION_ADDRESS } from '../const/contractAddresses';
import tokenPageStyles from '../styles/Token.module.css';
import NFTGrid from '@/components/NFT/NFTGrid';
import SaleInfo from '@/components/SaleInfo/SaleInfo';
import {
  ThirdwebNftMedia,
  useAddress,
  useContract,
  useOwnedNFTs,
} from '@thirdweb-dev/react';
import { NFT as NFTType } from '@thirdweb-dev/sdk';
import React, { useState } from 'react';

export default function Sell() {
  // Load all of the NFTs from the NFT Collection
  const { contract } = useContract(NFT_COLLECTION_ADDRESS);
  const address = useAddress();
  const { data, isLoading } = useOwnedNFTs(contract, address);

  const [selectedNft, setSelectedNft] = useState<NFTType>();

  return (
    <div className="container">
      <h1 className="text-3xl font-bold sm:text-5xl xl:text-6xl/none my-4 text-center">
        Sell NFTs
      </h1>
      {!selectedNft ? (
        <>
          <p className="text-lg text-center pb-4 text-gray-700">
            Select which NFT you&rsquo;d like to sell below.
          </p>
          <NFTGrid
            data={data}
            isLoading={isLoading}
            overrideOnclickBehavior={(nft) => {
              setSelectedNft(nft);
            }}
            emptyText={
              "Looks like you don't own any NFTs in this collection. Head to the buy page to buy some!"
            }
          />
        </>
      ) : (
        <div className={tokenPageStyles.container} style={{ marginTop: 0 }}>
          <div className={tokenPageStyles.metadataContainer}>
            <div className={tokenPageStyles.imageContainer}>
              <ThirdwebNftMedia
                metadata={selectedNft.metadata}
                className={tokenPageStyles.image}
              />
              <button
                onClick={() => {
                  setSelectedNft(undefined);
                }}
                className={tokenPageStyles.crossButton}
              >
                X
              </button>
            </div>
          </div>

          <div className={tokenPageStyles.listingContainer}>
            <p>You&rsquo;re about to list the following item for sale.</p>
            <h1 className={tokenPageStyles.title}>
              {selectedNft.metadata.name}
            </h1>
            <p className={tokenPageStyles.collectionName}>
              Token ID #{selectedNft.metadata.id}
            </p>

            <div className={tokenPageStyles.pricingContainer}>
              <SaleInfo nft={selectedNft} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
