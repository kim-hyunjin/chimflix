import type { NextApiRequest, NextApiResponse } from 'next';
import {
  findVideoStatsByUser,
  insertStats,
  updateFavAndSavedStats,
  updateTimeAndWatchedStats,
} from '@/lib/db/hasura';
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

async function updateFavsAndSavedWithToken(
  token: string,
  data: Pick<UpdateStatsData, 'videoId' | 'favourited' | 'saved'>
) {
  const issuer = getIssuerFromToken(token);

  const res = await updateFavAndSavedStats(token, {
    ...data,
    userId: issuer,
  });
  return res;
}

async function updateTimeAndWatchedWithToken(
  token: string,
  data: Pick<UpdateStatsData, 'videoId' | 'playedTime' | 'watched'>
) {
  const issuer = getIssuerFromToken(token);

  const res = await updateTimeAndWatchedStats(token, {
    ...data,
    userId: issuer,
  });
  return res;
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
      return;
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
        // console.log('request body', req.body);
        let updated: Stats;
        if (typeof req.body.playedTime != 'undefined') {
          const { playedTime, watched } = req.body;
          updated = await updateTimeAndWatchedWithToken(token, {
            videoId,
            playedTime,
            watched,
          });
        } else {
          const { favourited, saved } = req.body;
          updated = await updateFavsAndSavedWithToken(token, {
            videoId,
            favourited,
            saved,
          });
        }

        resp.send(updated);
      } else {
        const created = await createNewStats(token, videoId);
        resp.send(created);
      }
    }
  } catch (error: any) {
    console.error('Error occurred /stats', error);
    resp.status(500).send({ done: false, error: error?.message });
  }
}
