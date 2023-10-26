import ListingWrapper from '../../components/ListingWrapper/ListingWrapper';
import NFTGrid from '../../components/NFT/NFTGrid';
import {
  MARKETPLACE_ADDRESS,
  NFT_COLLECTION_ADDRESS,
} from '../../const/contractAddresses';
import styles from '../../styles/Profile.module.css';
import {
  useContract,
  useOwnedNFTs,
  useValidDirectListings,
  useValidEnglishAuctions,
} from '@thirdweb-dev/react';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

export default function ProfilePage() {
  const router = useRouter();
  const [tab, setTab] = useState<'nfts' | 'listings' | 'auctions'>('nfts');

  const { contract: nftCollection } = useContract(NFT_COLLECTION_ADDRESS);

  const { contract: marketplace } = useContract(
    MARKETPLACE_ADDRESS,
    'marketplace-v3'
  );

  const { data: ownedNfts, isLoading: loadingOwnedNfts } = useOwnedNFTs(
    nftCollection,
    router.query.address as string
  );

  const { data: directListings, isLoading: loadingDirects } =
    useValidDirectListings(marketplace, {
      seller: router.query.address as string,
    });

  const { data: auctionListings, isLoading: loadingAuctions } =
    useValidEnglishAuctions(marketplace, {
      seller: router.query.address as string,
    });

  return (
    <div className="container mx-8 mb-16">
      <div className={styles.tabs}>
        <h3
          className={`${styles.tab} 
        ${tab === 'nfts' ? styles.activeTab : ''}`}
          onClick={() => setTab('nfts')}
        >
          My NFTs
        </h3>
        <h3
          className={`${styles.tab} 
        ${tab === 'listings' ? styles.activeTab : ''}`}
          onClick={() => setTab('listings')}
        >
          Listings
        </h3>
        <h3
          className={`${styles.tab}
        ${tab === 'auctions' ? styles.activeTab : ''}`}
          onClick={() => setTab('auctions')}
        >
          Auctions
        </h3>
      </div>

      <div
        className={`${
          tab === 'nfts' ? styles.activeTabContent : styles.tabContent
        }`}
      >
        <NFTGrid
          data={ownedNfts}
          isLoading={loadingOwnedNfts}
          emptyText="Looks like you don't have any NFTs from this collection. Head to the buy page to buy some!"
        />
      </div>

      <div
        className={`${
          tab === 'listings' ? styles.activeTabContent : styles.tabContent
        }`}
      >
        {loadingDirects ? (
          <p>Loading...</p>
        ) : directListings && directListings.length === 0 ? (
          <p>Nothing for sale yet! Head to the sell tab to list an NFT.</p>
        ) : (
          directListings?.map((listing) => (
            <ListingWrapper listing={listing} key={listing.id} />
          ))
        )}
      </div>

      <div
        className={`${
          tab === 'auctions' ? styles.activeTabContent : styles.tabContent
        }`}
      >
        {loadingAuctions ? (
          <p>Loading...</p>
        ) : auctionListings && auctionListings.length === 0 ? (
          <p>Nothing for sale yet! Head to the sell tab to list an NFT.</p>
        ) : (
          auctionListings?.map((listing) => (
            <ListingWrapper listing={listing} key={listing.id} />
          ))
        )}
      </div>
    </div>
  );
}
