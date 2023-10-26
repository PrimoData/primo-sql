import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-sql';
import 'ace-builds/src-noconflict/theme-monokai';
import QueryResults from '@/components/QueryResults';
import Spinner from '@/components/Spinner';
import { Button } from '@/components/ui/button';
import { CardContent, Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { NFT_COLLECTION_ADDRESS } from '@/const/contractAddresses';
import { useAddress, useContract, Web3Button } from '@thirdweb-dev/react';
import React, { useState } from 'react';

type ResultType = { [key: string]: string | number }; // Adjust this type based on your actual data structure

export default function Mint() {
  const address = useAddress() ?? '';
  const { contract: nftCollection } = useContract(
    process.env.NEXT_PUBLIC_NFT_COLLECTION_ADDRESS!,
    'nft-collection'
  );
  const [results, setResults] = useState<ResultType[] | null>(null);
  const [isLoadingResults, setIsLoadingResults] = useState(false); // Add this line
  const [sqlQuery, setSqlQuery] = useState('');
  const [title, setTitle] = useState('');

  const runQuery = async () => {
    setIsLoadingResults(true);
    const res = await fetch('/api/chainbase', {
      method: 'POST',
      body: JSON.stringify(sqlQuery),
    });
    const response = await res.json();
    setResults(response.data.data.result);
    setIsLoadingResults(false);
  };

  //This function calls a Next JS API route that mints an NFT with signature-based minting.
  const mintWithSignature = async () => {
    try {
      const signedPayloadReq = await fetch(`/api/server`, {
        method: 'POST',
        body: JSON.stringify({
          name: title,
          authorAddress: address,
          sql: sqlQuery,
        }),
      });

      // Grab the JSON from the response
      const json = await signedPayloadReq.json();

      if (!signedPayloadReq.ok) {
        alert(json.error);
      }

      // Parse the signed payload from the response and store it in a variable called signedPayload.
      const signedPayload = json.signedPayload;

      // Call signature.mint and pass in the signed payload that we received, allowing the user to mint an NFT.
      const nft = await nftCollection?.signature.mint(signedPayload);
      return nft;
    } catch (e) {
      console.error('An error occurred trying to mint the NFT:', e);
    }
  };

  return (
    <>
      <div className="flex items-center justify-center h-screen md:mx-0 mx-4">
        <Card>
          <CardContent>
            <div className="space-y-8">
              <div className="space-y-2">
                <h2 className="text-3xl font-semibold mt-5">Mint SQL NFT</h2>
                <p className="text-zinc-500 dark:text-zinc-400">
                  Write your SQL query for Chainbase and mint as an NFT.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Daily Ethereum txn ct last 7 days"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="code-editor">SQL Query</Label>
                <AceEditor
                  mode="sql"
                  theme="monokai"
                  name="code-editor"
                  fontSize={14}
                  width="100%"
                  height="200px"
                  editorProps={{ $blockScrolling: true }}
                  showPrintMargin={false}
                  value={sqlQuery}
                  onChange={(newValue) => setSqlQuery(newValue)}
                />
              </div>
              {/* Data Preview */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    onClick={runQuery}
                    className="px-4 pb-2 mr-2 mb-4 bg-secondary"
                  >
                    Preview Data
                  </Button>
                </DialogTrigger>
                <DialogContent
                  className="w-full max-w-3xl overflow-y-auto py-4 my-8"
                  style={{ maxHeight: '80vh', minHeight: '40vh' }}
                >
                  {isLoadingResults ? (
                    <Spinner />
                  ) : (
                    results && <QueryResults results={results} />
                  )}
                </DialogContent>
              </Dialog>

              <Web3Button
                connectWallet={{
                  btnTitle: 'Create Query NFT',
                }}
                contractAddress={NFT_COLLECTION_ADDRESS}
                {...(sqlQuery ? null : { isDisabled: true })}
                onSuccess={(result) => alert('Created Query NFT!')}
                action={() => mintWithSignature()}
              >
                Create SQL NFT
              </Web3Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
