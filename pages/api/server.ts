import { ThirdwebSDK } from '@thirdweb-dev/sdk';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function server(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // De-structure the arguments we passed in out of the request body
    const { name, authorAddress, sql } = JSON.parse(req.body);

    // You'll need to add your private key in a .env.local file in the root of your project
    // !!!!! NOTE !!!!! NEVER LEAK YOUR PRIVATE KEY to anyone!
    if (!process.env.PRIVATE_KEY) {
      throw new Error("You're missing PRIVATE_KEY in your .env.local file.");
    }

    // Initialize the Thirdweb SDK on the serverside
    const sdk = ThirdwebSDK.fromPrivateKey(
      // Your wallet private key (read it in from .env.local file)
      process.env.PRIVATE_KEY as string,
      'mumbai',
      {
        secretKey: process.env.TW_SECRET_KEY,
      }
    );

    // Load the NFT Collection via it's contract address using the SDK
    const nftCollection = await sdk.getContract(
      // Use your NFT_COLLECTION_ADDRESS constant
      process.env.NEXT_PUBLIC_NFT_COLLECTION_ADDRESS!,
      'nft-collection'
    );

    // If all the checks pass, begin generating the signature...
    // Generate the signature for the page NFT

    const signedPayload = await nftCollection.signature.generate({
      to: authorAddress,
      metadata: {
        name: name,
        description: 'Chainbase SQL Query',
        image: 'https://chainbase.com/assets/brand/Logo_Icon_Black.svg',
        properties: {
          sql: sql,
        },
      },
    });

    // Return back the signedPayload to the client.
    res.status(200).json({
      signedPayload: JSON.parse(JSON.stringify(signedPayload)),
    });
  } catch (e) {
    res.status(500).json({ error: `Server error ${e}` });
  }
}
