import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  MARKETPLACE_ADDRESS,
  NFT_COLLECTION_ADDRESS,
} from '@/const/contractAddresses';
import toastStyle from '@/util/toastConfig';
import {
  useContract,
  useCreateAuctionListing,
  useCreateDirectListing,
  Web3Button,
} from '@thirdweb-dev/react';
import { NFT as NFTType } from '@thirdweb-dev/sdk';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

type Props = {
  nft: NFTType;
  contractMetadata: any;
};

type AuctionFormData = {
  nftContractAddress: string;
  tokenId: string;
  startDate: Date;
  endDate: Date;
  floorPrice: string;
  buyoutPrice: string;
};

type DirectFormData = {
  nftContractAddress: string;
  tokenId: string;
  price: string;
  startDate: Date;
  endDate: Date;
};

export default function SaleInfo({ nft }: Props) {
  const router = useRouter();
  // Connect to marketplace contract
  const { contract: marketplace } = useContract(
    MARKETPLACE_ADDRESS,
    'marketplace-v3'
  );

  // useContract is a React hook that returns an object with the contract key.
  // The value of the contract key is an instance of an NFT_COLLECTION on the blockchain.
  // This instance is created from the contract address (NFT_COLLECTION_ADDRESS)
  const { contract: nftCollection } = useContract(NFT_COLLECTION_ADDRESS);

  // Hook provides an async function to create a new auction listing
  const { mutateAsync: createAuctionListing } =
    useCreateAuctionListing(marketplace);

  // Hook provides an async function to create a new direct listing
  const { mutateAsync: createDirectListing } =
    useCreateDirectListing(marketplace);

  // Manage form values using react-hook-form library: Auction form
  const { register: registerAuction, handleSubmit: handleSubmitAuction } =
    useForm<AuctionFormData>({
      defaultValues: {
        nftContractAddress: NFT_COLLECTION_ADDRESS,
        tokenId: nft.metadata.id,
        startDate: new Date(),
        endDate: new Date(),
        floorPrice: '0',
        buyoutPrice: '0',
      },
    });

  // User requires to set marketplace approval before listing
  async function checkAndProvideApproval() {
    // Check if approval is required
    const hasApproval = await nftCollection?.call('isApprovedForAll', [
      nft.owner,
      MARKETPLACE_ADDRESS,
    ]);

    // If it is, provide approval
    if (!hasApproval) {
      const txResult = await nftCollection?.call('setApprovalForAll', [
        MARKETPLACE_ADDRESS,
        true,
      ]);

      if (txResult) {
        toast.success('Marketplace approval granted', {
          icon: '👍',
          style: toastStyle,
          position: 'bottom-center',
        });
      }
    }

    return true;
  }

  // Manage form values using react-hook-form library: Direct form
  const { register: registerDirect, handleSubmit: handleSubmitDirect } =
    useForm<DirectFormData>({
      defaultValues: {
        nftContractAddress: NFT_COLLECTION_ADDRESS,
        tokenId: nft.metadata.id,
        startDate: new Date(),
        endDate: new Date(),
        price: '0',
      },
    });

  async function handleSubmissionAuction(data: AuctionFormData) {
    await checkAndProvideApproval();
    const txResult = await createAuctionListing({
      assetContractAddress: data.nftContractAddress,
      tokenId: data.tokenId,
      buyoutBidAmount: data.buyoutPrice,
      minimumBidAmount: data.floorPrice,
      startTimestamp: new Date(data.startDate),
      endTimestamp: new Date(data.endDate),
    });

    return txResult;
  }

  async function handleSubmissionDirect(data: DirectFormData) {
    await checkAndProvideApproval();
    const txResult = await createDirectListing({
      assetContractAddress: data.nftContractAddress,
      tokenId: data.tokenId,
      pricePerToken: data.price,
      startTimestamp: new Date(data.startDate),
      endTimestamp: new Date(data.endDate),
    });

    return txResult;
  }

  return (
    <>
      <Tabs defaultValue="direct" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="direct">Direct</TabsTrigger>
          <TabsTrigger value="auction">Auction</TabsTrigger>
        </TabsList>
        <TabsContent value="direct">
          <Card>
            <CardContent className="space-y-2 mt-4">
              <div>
                <h4 className="text-lg font-semibold mt-2">When</h4>

                {/* Input field for auction start date */}
                <div className="space-y-1">
                  <Label> Listing Starts on </Label>
                  <Input
                    type="datetime-local"
                    {...registerDirect('startDate')}
                    aria-label="Auction Start Date"
                  />
                </div>

                {/* Input field for auction end date */}
                <div className="space-y-1">
                  <Label> Listing Ends on </Label>
                  <Input
                    type="datetime-local"
                    {...registerDirect('endDate')}
                    aria-label="Auction End Date"
                  />
                </div>

                <h4 className="text-lg font-semibold mt-2">Price</h4>

                {/* Input field for buyout price */}
                <div className="space-y-1 mb-2">
                  <Label>Price per token</Label>
                  <Input
                    type="number"
                    step={0.000001}
                    {...registerDirect('price')}
                  />
                </div>

                <Web3Button
                  contractAddress={MARKETPLACE_ADDRESS}
                  action={async () => {
                    await handleSubmitDirect(handleSubmissionDirect)();
                  }}
                  className={'bg-secondary'}
                  onError={(error) => {
                    toast(`Listed Failed! Reason: ${error.cause}`, {
                      icon: '❌',
                      style: toastStyle,
                      position: 'bottom-center',
                    });
                  }}
                  onSuccess={(txResult) => {
                    toast('Listed Successfully!', {
                      icon: '🥳',
                      style: toastStyle,
                      position: 'bottom-center',
                    });
                    router.push(
                      `/token/${NFT_COLLECTION_ADDRESS}/${nft.metadata.id}`
                    );
                  }}
                >
                  Create Direct Listing
                </Web3Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="auction">
          <Card>
            <CardContent className="space-y-2 mt-4">
              {/* Auction listing fields */}
              <div>
                <h4 className="text-lg font-semibold">When </h4>

                {/* Input field for auction start date */}
                <div className="space-y-1">
                  <Label> Auction Starts on </Label>
                  <Input
                    type="datetime-local"
                    {...registerAuction('startDate')}
                    aria-label="Auction Start Date"
                  />
                </div>

                {/* Input field for auction end date */}
                <div className="space-y-1">
                  <Label> Auction Ends on </Label>
                  <Input
                    type="datetime-local"
                    {...registerAuction('endDate')}
                    aria-label="Auction End Date"
                  />
                </div>

                <h4 className="text-lg font-semibold mt-2">Price </h4>
                {/* Input field for minimum bid price */}
                <div className="space-y-1">
                  <Label> Allow bids starting from </Label>
                  <Input
                    step={0.000001}
                    type="number"
                    {...registerAuction('floorPrice')}
                  />
                </div>

                {/* Input field for buyout price */}
                <div className="space-y-1 mb-2">
                  <Label> Buyout price </Label>
                  <Input
                    type="number"
                    step={0.000001}
                    {...registerAuction('buyoutPrice')}
                  />
                </div>

                <Web3Button
                  contractAddress={MARKETPLACE_ADDRESS}
                  action={async () => {
                    return await handleSubmitAuction(handleSubmissionAuction)();
                  }}
                  className={'bg-secondary'}
                  onError={(error) => {
                    toast(`Listed Failed! Reason: ${error.cause}`, {
                      icon: '❌',
                      style: toastStyle,
                      position: 'bottom-center',
                    });
                  }}
                  onSuccess={(txResult) => {
                    toast('Listed Successfully!', {
                      icon: '🥳',
                      style: toastStyle,
                      position: 'bottom-center',
                    });
                    router.push(
                      `/token/${NFT_COLLECTION_ADDRESS}/${nft.metadata.id}`
                    );
                  }}
                >
                  Create Auction Listing
                </Web3Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}
