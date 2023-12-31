import QueryResults from '@/components/QueryResults';
import SaleInfo from '@/components/SaleInfo/SaleInfo';
import Spinner from '@/components/Spinner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ETHERSCAN_URL,
  MARKETPLACE_ADDRESS,
  NETWORK,
  NFT_COLLECTION_ADDRESS,
} from '@/const/contractAddresses';
import toastStyle from '@/util/toastConfig';
import {
  ThirdwebNftMedia,
  useContract,
  useContractEvents,
  useValidDirectListings,
  useValidEnglishAuctions,
  Web3Button,
  useAddress,
} from '@thirdweb-dev/react';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';
import { Database } from 'lucide-react';
import { AlertCircle } from 'lucide-react';
import { Terminal } from 'lucide-react';
import { GetStaticProps, GetStaticPaths } from 'next';
import Link from 'next/link';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

type MetadataProperties = {
  sql: string;
};

type ThirdWebNFT = {
  owner: string;
  type: 'ERC1155' | 'ERC721' | 'metaplex';
  supply: string;
  metadata: {
    properties: MetadataProperties;
    uri: string;
    name: string;
    id: string;
  };
};

type Props = {
  nft: ThirdWebNFT;
  contractMetadata: any;
};

type ResultType = { [key: string]: string | number }; // Adjust this type based on your actual data structure

export default function TokenPage({ nft, contractMetadata }: Props) {
  const [results, setResults] = useState<ResultType[] | null>(null);
  const [isLoadingResults, setIsLoadingResults] = useState(false); // Add this line
  const address = useAddress();

  const runQuery = async () => {
    setIsLoadingResults(true);
    const res = await fetch('../../api/chainbase', {
      method: 'POST',
      body: JSON.stringify(nft?.metadata?.properties?.sql),
    });
    const response = await res.json();
    setResults(response.data.data.result);
    setIsLoadingResults(false);
  };

  const [bidValue, setBidValue] = useState<string>();

  // Connect to marketplace smart contract
  const { contract: marketplace, isLoading: loadingContract } = useContract(
    MARKETPLACE_ADDRESS,
    'marketplace-v3'
  );

  // Connect to NFT Collection smart contract
  const { contract: nftCollection } = useContract(NFT_COLLECTION_ADDRESS);

  const { data: directListing, isLoading: loadingDirect } =
    useValidDirectListings(marketplace, {
      tokenContract: NFT_COLLECTION_ADDRESS,
      tokenId: nft?.metadata?.id,
    });

  // 2. Load if the NFT is for auction
  const { data: auctionListing, isLoading: loadingAuction } =
    useValidEnglishAuctions(marketplace, {
      tokenContract: NFT_COLLECTION_ADDRESS,
      tokenId: nft?.metadata?.id,
    });

  // Load historical transfer events: TODO - more event types like sale
  const { data: transferEvents, isLoading: loadingTransferEvents } =
    useContractEvents(nftCollection, 'Transfer', {
      queryFilter: {
        filters: {
          tokenId: nft?.metadata?.id,
        },
        order: 'desc',
      },
    });

  async function createBidOrOffer() {
    let txResult;
    if (!bidValue) {
      toast(`Please enter a bid value`, {
        icon: '❌',
        style: toastStyle,
        position: 'bottom-center',
      });
      return;
    }

    if (auctionListing?.[0]) {
      txResult = await marketplace?.englishAuctions.makeBid(
        auctionListing[0].id,
        bidValue
      );
    } else if (directListing?.[0]) {
      txResult = await marketplace?.offers.makeOffer({
        assetContractAddress: NFT_COLLECTION_ADDRESS,
        tokenId: nft?.metadata?.id ?? '',
        totalPrice: bidValue || '0',
      });
    } else {
      throw new Error('No valid listing found for this NFT');
    }

    return txResult;
  }

  async function buyListing() {
    let txResult;

    if (auctionListing?.[0]) {
      txResult = await marketplace?.englishAuctions.buyoutAuction(
        auctionListing[0].id
      );
    } else if (directListing?.[0]) {
      txResult = await marketplace?.directListings.buyFromListing(
        directListing[0].id,
        1
      );
    } else {
      throw new Error('No valid listing found for this NFT');
    }
    return txResult;
  }

  return (
    <div className="container mx-auto md:px-32 mb-16 mt-8 gap-4 grid md:grid-cols-2 ">
      {/* Summary Info */}
      <div className="">
        <ThirdwebNftMedia
          metadata={{
            ...nft?.metadata,
            id: nft?.metadata?.id ?? 'default_id',
            uri: nft?.metadata?.uri ?? 'default_uri',
          }}
          style={{ height: '100px' }}
          className="mx-auto"
        />
        <h1 className="text-3xl font-bold my-2 text-center">
          {nft?.metadata?.name}
        </h1>
        <p className="text-lg text-center text-gray-700">
          Token ID #{nft?.metadata?.id}
        </p>
        <p className="text-m text-center text-gray-700">
          <Link href={`/profile/${nft?.owner}`} className="">
            Current Owner:
            {nft?.owner?.slice(0, 8)}...{nft?.owner?.slice(-4)}
          </Link>
        </p>

        {/* Data Preview */}
        <div className="text-center">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                onClick={runQuery}
                className="px-4 py-2 my-4 bg-secondary"
              >
                <Database className="mr-2 h-4 w-4" />
                Preview Data
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

        {/* History */}
        <div className="">
          <div className="mb-4">
            {address === nft?.owner ? (
              <Alert>
                <Terminal className="h-4 w-4" />
                <AlertTitle>SQL Query</AlertTitle>
                <AlertDescription>
                  {nft?.metadata?.properties?.sql}
                </AlertDescription>
              </Alert>
            ) : (
              <></>
            )}
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">History</h3>
          <Table className="border-2 rounded shadow-lg">
            <TableHeader>
              <TableRow>
                <TableHead>Event</TableHead>
                <TableHead>From</TableHead>
                <TableHead>To</TableHead>
                <TableHead>Transaction</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transferEvents?.map((event, index) => (
                <TableRow key={event.transaction.transactionHash}>
                  <TableCell>
                    {index === transferEvents.length - 1 ? 'Mint' : 'Transfer'}
                  </TableCell>
                  <TableCell>
                    {event.data.from?.slice(0, 4)}...
                    {event.data.from?.slice(-2)}
                  </TableCell>
                  <TableCell>
                    {event.data.to?.slice(0, 4)}...
                    {event.data.to?.slice(-2)}
                  </TableCell>
                  <TableCell>
                    <a
                      href={`${ETHERSCAN_URL}/tx/${event.transaction.transactionHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Transaction ↗
                    </a>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Buy/Sell */}
      {address === nft?.owner ? (
        <div className="flex flex-col items-center">
          <h3 className="text-xl font-bold text-gray-800 mb-2">Sell</h3>
          <SaleInfo nft={nft} contractMetadata={contractMetadata} />
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <h3 className="text-xl font-bold text-gray-800 mb-2">Buy</h3>

          <Card className="w-[350px]">
            <CardContent className="mt-4">
              <div className="flex flex-col">
                <div className="mt-2">
                  {loadingContract || loadingDirect || loadingAuction ? (
                    <Spinner />
                  ) : (
                    <>
                      {directListing && directListing[0] ? (
                        <>
                          {directListing[0]?.currencyValuePerToken.displayValue}
                          {' ' + directListing[0]?.currencyValuePerToken.symbol}
                        </>
                      ) : auctionListing && auctionListing[0] ? (
                        <>
                          {auctionListing[0]?.buyoutCurrencyValue.displayValue}
                          {' ' + auctionListing[0]?.buyoutCurrencyValue.symbol}
                        </>
                      ) : (
                        <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertTitle>Not for sale</AlertTitle>
                        </Alert>
                      )}
                    </>
                  )}
                </div>

                <div className="mt-2">
                  {loadingAuction ? (
                    <></>
                  ) : (
                    <>
                      {auctionListing && auctionListing[0] && (
                        <>
                          <p className="mt-3 text-sm font-semibold">
                            Bids starting from
                          </p>

                          <div className="mt-1">
                            {
                              auctionListing[0]?.minimumBidCurrencyValue
                                .displayValue
                            }
                            {' ' +
                              auctionListing[0]?.minimumBidCurrencyValue.symbol}
                          </div>
                        </>
                      )}
                    </>
                  )}
                </div>

                {loadingContract || loadingDirect || loadingAuction ? (
                  <></>
                ) : (
                  <>
                    <Web3Button
                      contractAddress={MARKETPLACE_ADDRESS}
                      action={async () => await buyListing()}
                      className="mt-4 px-4 py- rounded"
                      onSuccess={() => {
                        toast(`Purchase success!`, {
                          icon: '✅',
                          style: toastStyle,
                          position: 'bottom-center',
                        });
                      }}
                      onError={(e) => {
                        toast(`Purchase failed! Reason: ${e.message}`, {
                          icon: '❌',
                          style: toastStyle,
                          position: 'bottom-center',
                        });
                      }}
                    >
                      Buy at asking price
                    </Web3Button>

                    <div className="mt-2">
                      <p className="text-sm font-semibold">or</p>
                    </div>

                    <input
                      className="mt-2 px-3 py-2 border rounded"
                      defaultValue={
                        auctionListing?.[0]?.minimumBidCurrencyValue
                          ?.displayValue || 0
                      }
                      type="number"
                      step={0.000001}
                      onChange={(e) => {
                        setBidValue(e.target.value);
                      }}
                    />

                    <Web3Button
                      contractAddress={MARKETPLACE_ADDRESS}
                      action={async () => await createBidOrOffer()}
                      className="mt-2 px-4 py-2 rounded"
                      onSuccess={() => {
                        toast(`Bid success!`, {
                          icon: '✅',
                          style: toastStyle,
                          position: 'bottom-center',
                        });
                      }}
                      onError={(e) => {
                        console.log(e);
                        toast(`Bid failed! Reason: ${e.message}`, {
                          icon: '❌',
                          style: toastStyle,
                          position: 'bottom-center',
                        });
                      }}
                    >
                      Place bid
                    </Web3Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

export const getStaticProps: GetStaticProps = async (context) => {
  const tokenId = context.params?.tokenId as string;

  const sdk = new ThirdwebSDK(NETWORK, {
    secretKey: process.env.TW_SECRET_KEY,
  });

  const contract = await sdk.getContract(NFT_COLLECTION_ADDRESS);

  const nft = await contract.erc721.get(tokenId);

  let contractMetadata;

  try {
    contractMetadata = await contract.metadata.get();
  } catch (e) {}

  return {
    props: {
      nft,
      contractMetadata: contractMetadata || null,
    },
    revalidate: 1, // https://nextjs.org/docs/basic-features/data-fetching/incremental-static-regeneration
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const sdk = new ThirdwebSDK(NETWORK, {
    secretKey: process.env.TW_SECRET_KEY,
  });

  const contract = await sdk.getContract(NFT_COLLECTION_ADDRESS);

  const nfts = await contract.erc721.getAll();

  const paths = nfts.map((nft) => {
    return {
      params: {
        contractAddress: NFT_COLLECTION_ADDRESS,
        tokenId: nft.metadata.id,
      },
    };
  });

  return {
    paths,
    fallback: 'blocking', // can also be true or 'blocking'
  };
};
