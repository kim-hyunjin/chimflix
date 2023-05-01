import type { NextApiRequest, NextApiResponse } from 'next';
import { findVideoStatsByUser, insertStats, updateStats } from '@/lib/db/hasura';
import { Stats } from '@/types/hasura';
import { getIssuerFromToken } from '@/lib/token';

export async function getStatsData(token: string, videoId: string) {
  const issuer = getIssuerFromToken(token);

  return await findVideoStatsByUser(token, issuer, videoId);
}

export async function createNewStats(token: string, videoId: string) {
  const issuer = getIssuerFromToken(token);

  return await insertStats(token, issuer, videoId);
}

type UpdateStatsData = Omit<Stats, 'id' | 'userId'>;

export async function updateStatsWithToken(token: string, data: UpdateStatsData) {
  const issuer = getIssuerFromToken(token);

  return await updateStats(token, {
    ...data,
    userId: issuer,
  });
}

export default async function handler(req: NextApiRequest, resp: NextApiResponse) {
  if (req.method && !['GET', 'POST'].includes(req.method)) {
    resp.status(405).send({ done: false });
    return;
  }
  try {
    const token = req.cookies.token;
    if (!token) {
      resp.status(403).send({ done: false, msg: 'not exist token in cookie' });
      return;
    }

    const videoId = req.method === 'POST' ? req.body.videoId : req.query.videoId;
    if (!videoId) {
      resp.status(400).send({ done: false, msg: 'bad request - not exist videoId' });
    }

    const foundVideoStats = await getStatsData(token, videoId);

    if (req.method === 'GET') {
      if (foundVideoStats) {
        resp.send({ foundVideoStats });
      } else {
        resp.status(404).send({ user: null, msg: 'video not found' });
      }
      return;
    }

    if (req.method === 'POST') {
      if (foundVideoStats) {
        const { favourited, watched = true } = req.body;
        const updated = await updateStatsWithToken(token, { videoId, favourited, watched });
        resp.send({ msg: 'it works', updated });
      } else {
        const created = await createNewStats(token, videoId);
        resp.send({ msg: 'it works', created });
      }
    }
  } catch (error: any) {
    console.error('Error occurred /stats', error);
    resp.status(500).send({ done: false, error: error?.message });
  }
}
