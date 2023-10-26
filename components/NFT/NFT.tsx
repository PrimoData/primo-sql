import {
  MARKETPLACE_ADDRESS,
  NFT_COLLECTION_ADDRESS,
} from '../../const/contractAddresses';
import QueryResults from '@/components/QueryResults';
import Spinner from '@/components/Spinner';
import { Button } from '@/components/ui/button';
import { CardContent, Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import {
  ThirdwebNftMedia,
  useContract,
  useValidDirectListings,
  useValidEnglishAuctions,
} from '@thirdweb-dev/react';
import { NFT } from '@thirdweb-dev/sdk';
import { Search, Database } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';

// type MetadataProperties = {
//   sql: string;
// };

// type NFT = {
//   owner: string;
//   type: 'ERC1155' | 'ERC721' | 'metaplex';
//   supply: string;
//   metadata: {
//     properties: MetadataProperties;
//     uri: string;
//     name: string;
//     id: string;
//   };
// };

type Props = {
  nft: NFT;
};

type ResultType = { [key: string]: string | number };

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

  const [results, setResults] = useState<ResultType[] | null>(null);
  const [isLoadingResults, setIsLoadingResults] = useState(false); // Add this line

  const runQuery = async () => {
    setIsLoadingResults(true);
    const res = await fetch('../../api/chainbase', {
      method: 'POST',
      body: JSON.stringify((nft?.metadata?.properties as { sql: string })?.sql),
    });
    const response = await res.json();
    setResults(response.data.data.result);
    setIsLoadingResults(false);
  };

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
        <div className="flex mt-4 space-x-2">
          <Button asChild className="bg-dark-blue">
            <Link href={`/token/${NFT_COLLECTION_ADDRESS}/${nft.metadata.id}`}>
              <Search className="mr-2 h-4 w-4" />
              View NFT
            </Link>
          </Button>
          {/* Data Preview */}
          <div className="">
            <Dialog>
              <DialogTrigger asChild>
                <Button onClick={runQuery} className="bg-secondary">
                  <Database className="mr-2 h-4 w-4" />
                  See Data
                </Button>
              </DialogTrigger>
              <DialogContent
                className="w-full max-w-3xl overflow-y-auto py-4 my-8"
                style={{ maxHeight: '80vh' }}
              >
                {isLoadingResults ? (
                  <Spinner />
                ) : (
                  results && <QueryResults results={results} />
                )}
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
