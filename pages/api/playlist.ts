import { getPlaylistDetail, getPlaylists } from '@/lib/videos';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, resp: NextApiResponse) {
  if (req.method && req.method !== 'GET') {
    resp.status(405).send({ done: false });
    return;
  }
  try {
    const pageToken = req.query.pageToken ? String(req.query.pageToken) : undefined;
    const playlistId = req.query.id ? String(req.query.id) : undefined;

    if (playlistId) {
      const detail = await getPlaylistDetail(playlistId);
      resp.send(detail);
      return;
    }

    const playlists = await getPlaylists(pageToken);
    resp.send(playlists);
  } catch (error: any) {
    console.error('Error occurred /search', error);
    resp.status(500).send({ done: false, error: error?.message });
  }
}
