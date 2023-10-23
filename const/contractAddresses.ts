/** Replace the values below with the addresses of your smart contracts. */

// 1. Set up the network your smart contracts are deployed to.
// First, import the chain from the package, then set the NETWORK variable to the chain.
import { ArbitrumGoerli } from '@thirdweb-dev/chains';
export const NETWORK = ArbitrumGoerli;

// 2. The address of the marketplace V3 smart contract.
// Deploy your own: https://thirdweb.com/thirdweb.eth/MarketplaceV3
export const MARKETPLACE_ADDRESS = '0x199FF0B325cC0c947468bDaf0Cb8C4e60235865e';

// 3. The address of your NFT collection smart contract.
export const NFT_COLLECTION_ADDRESS =
  '0x4091Af43772F9B84e6eCA13ef358167C761D5cf9';

// (Optional) Set up the URL of where users can view transactions on
// For example, below, we use Mumbai.polygonscan to view transactions on the Mumbai testnet.
export const ETHERSCAN_URL = 'https://testnet.arbiscan.io/';
