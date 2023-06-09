import {
  findVideoStatsByUser,
  insertStats,
  updateFavAndSavedStats,
  updateTimeAndWatchedStats,
} from '@/lib/db/hasura';
import { Stats } from '@/types/hasura';
import { getIssuerFromToken } from '@/lib/token';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const token = cookies().get('token')?.value;
    if (!token) {
      console.error('not exist token in cookie');
      return new Response(null, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const videoId = searchParams.get('videoId');
    if (!videoId) {
      console.error('bad request - not exist videoId');
      return new Response(null, { status: 400 });
    }

    const foundVideoStats = await getStatsData(token, videoId);

    if (foundVideoStats) {
      return NextResponse.json(foundVideoStats);
    } else {
      return new Response(null, { status: 404 });
    }
  } catch (error: any) {
    console.error('Error occurred /stats', error);
    return new Response(null, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const token = cookies().get('token')?.value;
    if (!token) {
      console.error('not exist token in cookie');
      return new Response(null, { status: 403 });
    }
    const body = await req.json();
    const { videoId } = body;
    if (!videoId) {
      console.error('bad request - not exist videoId');
      return new Response(null, { status: 400 });
    }

    const foundVideoStats = await getStatsData(token, videoId);

    if (foundVideoStats) {
      let updated: Stats;
      const { playedTime, watched, favourited, saved } = body;
      if (typeof playedTime != 'undefined') {
        updated = await updateTimeAndWatchedWithToken(token, {
          videoId,
          playedTime,
          watched,
        });
      } else {
        updated = await updateFavsAndSavedWithToken(token, {
          videoId,
          favourited,
          saved,
        });
      }

      return NextResponse.json(updated);
    } else {
      const created = await createNewStats(token, videoId);
      return NextResponse.json(created);
    }
  } catch (error: any) {
    console.error('Error occurred /stats', error);
    return new Response(null, { status: 500 });
  }
}

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
