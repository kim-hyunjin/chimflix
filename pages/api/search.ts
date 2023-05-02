import { getVideos, getVideosWithKeyword } from '@/lib/videos';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, resp: NextApiResponse) {
  if (req.method && req.method !== 'GET') {
    resp.status(405).send({ done: false });
    return;
  }
  try {
    const title = req.query.title ? String(req.query.title) : undefined;
    const keyword = req.query.keyword ? String(req.query.keyword) : undefined;
    const order =
      req.query.order === 'date' || req.query.order === 'viewCount' ? req.query.order : undefined;
    const pageToken = req.query.pageToken ? String(req.query.pageToken) : undefined;

    if (title && keyword) {
      const result = await getVideosWithKeyword({
        title,
        keyword,
        order,
        pageToken,
      });
      resp.send(result);
      return;
    }

    const result = await getVideos({ order, pageToken });
    resp.send(result);
  } catch (error: any) {
    console.error('Error occurred /stats', error);
    resp.status(500).send({ done: false, error: error?.message });
  }
}
