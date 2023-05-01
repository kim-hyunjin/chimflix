import { getVideoDetail, getWatchItAgainVideos } from '@/lib/videos';
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

    const watched = await getWatchItAgainVideos(token);
    resp.send(watched);
  } catch (error: any) {
    console.error('Error occurred /stats', error);
    resp.status(500).send({ done: false, error: error?.message });
  }
}
