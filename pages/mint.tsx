import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-sql';
import 'ace-builds/src-noconflict/theme-monokai';
import QueryResults from '../components/QueryResults';
import Spinner from '../components/Spinner';
import { NFT_COLLECTION_ADDRESS } from '../const/contractAddresses';
import { Button } from '@/components/ui/button';
import { CardContent, Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  useAddress,
  useContract,
  useMintNFT,
  Web3Button,
} from '@thirdweb-dev/react';
import React, { useState } from 'react';

type ResultType = { [key: string]: string | number }; // Adjust this type based on your actual data structure

export default function Mint() {
  // Load all of the NFTs from the NFT Collection
  const { contract } = useContract(NFT_COLLECTION_ADDRESS);
  const address = useAddress() ?? '';
  const { mutateAsync: mintNft, isLoading, error } = useMintNFT(contract);
  const [results, setResults] = useState<ResultType[] | null>(null);
  const [isLoadingResults, setIsLoadingResults] = useState(false); // Add this line
  const [sqlQuery, setSqlQuery] = useState('');
  const [title, setTitle] = useState('');

  const runQuery = async () => {
    const res = await fetch('/api/chainbase', {
      method: 'POST',
      body: JSON.stringify(sqlQuery),
    });
    const response = await res.json();
    setResults(response.data.data.result);
  };

  return (
    <>
      <div className="flex items-center justify-center h-screen">
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
                    className="px-4 pb-2 mr-2 mb-4 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
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

              <Web3Button
                connectWallet={{
                  btnTitle: 'Create Query NFT',
                }}
                className={
                  'bg-green-500 text-white rounded px-4 py-2 hover:bg-green-600 mb-4'
                }
                contractAddress={NFT_COLLECTION_ADDRESS}
                {...(sqlQuery ? null : { isDisabled: true })}
                onSuccess={(result) => alert('Created Query NFT!')}
                action={() =>
                  mintNft({
                    metadata: {
                      name: title,
                      description: 'Chainbase SQL Query',
                      image:
                        'https://chainbase.com/assets/brand/Logo_Icon_Black.svg',
                      properties: {
                        createdByAddress: address,
                        queryType: 'test',
                        sql: sqlQuery,
                      },
                    },
                    to: address,
                  })
                }
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
