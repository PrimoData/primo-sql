// pages/api/chainbase.ts
import { NextApiResponse, NextApiRequest } from 'next';
import axios from 'axios';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const sql = JSON.parse(req.body);

  try {
    const response = await axios.post(
      'https://api.chainbase.online/v1/dw/query',
      {
        query: sql,
      },
      {
        headers: {
          'x-api-key': process.env.CHAINBASE_KEY || '',
        },
      }
    );
    console.log('data returned from chainbase');
    res.status(200).json({ data: response.data });
  } catch (error) {
    // console.error('Error running query:', error);
    res.status(500).json({ error: 'Error running query' });
  }
}
