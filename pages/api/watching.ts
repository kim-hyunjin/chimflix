import { getSavedVideos, getWatchingNowVideos } from '@/lib/db/hasura';
import { getIssuerFromToken } from '@/lib/token';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, resp: NextApiResponse) {
  if (req.method && req.method !== 'GET') {
    resp.status(405).send({ done: false });
    return;
  }
  try {
    const token = req.cookies.token;
    if (!token) {
      resp.status(403).send({ done: false, msg: 'not exist token in cookie' });
      return;
    }
    const offset = req.query.offset;
    const issuer = getIssuerFromToken(token);
    const watching = await getWatchingNowVideos(token, issuer, offset ? Number(offset) : undefined);
    resp.send(watching);
  } catch (error: any) {
    console.error('Error occurred /search', error);
    resp.status(500).send({ done: false, error: error?.message });
  }
}
