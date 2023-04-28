import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { findVideoIdByUser } from '@/lib/db/hasura';

export async function getStatsData(token: string, videoId: string) {
  const decoded = jwt.verify(token, String(process.env.JWT_SECRET));
  console.log({ decoded });
  if (typeof decoded === 'string' || !decoded.issuer) {
    throw Error('wrong token');
  }
  const foundVideoStats = await findVideoIdByUser(token, decoded.issuer, videoId);
  console.log({ foundVideoStats });
  return foundVideoStats;
}

export default async function handler(req: NextApiRequest, resp: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const token = req.cookies.token;
      if (!token) {
        resp.status(403).send({});
      } else {
        const foundVideoStats = await getStatsData(token, String(req.query.videoId));
        if (foundVideoStats) {
          // update it
        } else {
          // add it
        }
        resp.send({ msg: 'it works', foundVideoStats });
      }
    } catch (error: any) {
      console.error('Error occurred /stats', error);
      resp.status(500).send({ done: false, error: error?.message });
    }
  } else {
    resp.status(405).send({ done: false });
  }
}
