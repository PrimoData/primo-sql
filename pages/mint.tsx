// import '../styles/globals.css';
import Container from '../components/Container/Container';
import { NFT_COLLECTION_ADDRESS } from '../const/contractAddresses';
import {
  useAddress,
  useContract,
  useMintNFT,
  Web3Button,
} from '@thirdweb-dev/react';
import React, { useState } from 'react';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-sql';
import 'ace-builds/src-noconflict/theme-monokai';
import QueryResults from '../components/QueryResults';
import Spinner from '../components/Spinner';

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
    <Container maxWidth="lg">
      <h1 className="text-4xl font-bold mb-4">Mint NFT</h1>
      <p>Mint a SQL NFT to the collection.</p>
      <div className="border shadow-xl p-5 rounded-xl mt-5">
        <h2 className="text-2xl font-semibold mb-2">Title</h2>
        <input
          className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4 w-full"
          id="title"
          type="text"
          placeholder="Count of daily Ethereum transactions last 7 days"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <h2 className="text-2xl font-semibold mb-2">SQL Query</h2>
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
        <button
          onClick={runQuery}
          className="px-4 py-2 mt-4 mr-2 bg-blue-500 text-white rounded hover:bg-blue-600 mb-4"
        >
          Run Query
        </button>
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
                image: 'https://chainbase.com/assets/brand/Logo_Icon_Black.svg',
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
        {isLoadingResults ? (
          <Spinner />
        ) : (
          results && <QueryResults results={results} />
        )}
      </div>
    </Container>
  );
}
