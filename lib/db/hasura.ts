import { Stats } from '@/types/hasura';
import { YoutubeSnippet } from '@/types/youtube';

async function fetchGraphQL(
  operationsDoc: string,
  operationName: string,
  variables: any,
  token: string
) {
  const result = await fetch(String(process.env.NEXT_PUBLIC_HASURA_URL), {
    method: 'POST',
    headers: {
      'x-hasura-admin-secret': String(process.env.NEXT_PUBLIC_HASURA_SECRET),
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      query: operationsDoc,
      variables: variables,
      operationName: operationName,
    }),
  });

  return await result.json();
}

const operationsDoc = `
  query Users {
    users {
      email
      issuer
    }
  }

  query UserByIssuer($issuer: String!) {
    users(where: {
      issuer: {
        _eq: $issuer
      }
    }) {
      email
      issuer
    }
  }

  mutation InsertUser($email: String!, $issuer: String!) {
    insert_users(objects: {email: $email, issuer: $issuer}) {
      affected_rows
    }
  }

  query StatsByIssuer($issuer: String!, $videoId: String!) {
    stats(where: {
      userId: {
        _eq: $issuer
      },
      videoId: {
        _eq: $videoId
      }
    }) {
      id
      userId
      videoId
      favourited
      watched
      saved
      playedTime
    }
  }

  mutation InsertStats($userId: String!, $videoId: String!) {
    insert_stats_one(object: {
      userId: $userId
      videoId: $videoId
    }) {
      id
      userId
      videoId
      favourited
      watched
      saved
    }
  }

  mutation UpdateStats($favourited: Int, $userId: String!, $watched: Boolean!, $saved: Boolean!, $playedTime: Int!, $videoId: String!) {
    update_stats(
      _set: {watched: $watched, favourited: $favourited, saved: $saved, playedTime: $playedTime}, 
      where: {
        userId: {_eq: $userId}, 
        videoId: {_eq: $videoId}
      }) {
      returning {
        id
        userId
        videoId
        favourited
        watched
        saved
        playedTime
      }
    }
  }

  query WatchedVideos($userId: String!, $offset: Int!) {
    stats_aggregate(order_by: {id: desc}, limit: 10, offset: $offset, where: {
      watched: {_eq: true}, 
      userId: {_eq: $userId},
    }) {
      nodes {
        videoId
      }
      aggregate {
        count
      }
    }
  }
`;

export async function isNewUser(token: string, issuer: string) {
  const res = await fetchGraphQL(
    operationsDoc,
    'UserByIssuer',
    {
      issuer,
    },
    token
  );

  return res?.data?.users?.length === 0;
}

export async function createNewUser(token: string, metadata: { email: string; issuer: string }) {
  await fetchGraphQL(operationsDoc, 'InsertUser', metadata, token);
}

export async function findVideoStatsByUser(
  token: string,
  issuer: string,
  videoId: string
): Promise<Stats | undefined> {
  const res = await fetchGraphQL(operationsDoc, 'StatsByIssuer', { issuer, videoId }, token);
  if (res?.data?.stats?.length) {
    return res?.data?.stats[0];
  }
  return undefined;
}

export async function insertStats(token: string, issuer: string, videoId: string): Promise<Stats> {
  const created = await fetchGraphQL(
    operationsDoc,
    'InsertStats',
    {
      userId: issuer,
      videoId,
    },
    token
  );

  return created.data.insert_stats_one;
}

export async function updateStats(
  token: string,
  metadata: {
    favourited: number | null;
    userId: string;
    watched: boolean;
    saved: boolean;
    videoId: string;
  }
): Promise<Stats> {
  const res = await fetchGraphQL(operationsDoc, 'UpdateStats', metadata, token);
  return res.data.update_stats.returning[0];
}

export async function getWatchedVideos(
  token: string,
  issuer: string,
  offset: number = 0
): Promise<{ watched: YoutubeSnippet[]; total: number } | undefined> {
  const res = await fetchGraphQL(
    operationsDoc,
    'WatchedVideos',
    {
      userId: issuer,
      offset,
    },
    token
  );
  console.log(res?.data?.stats_aggregate);
  if (res?.data?.stats_aggregate) {
    const watched = res.data.stats_aggregate.nodes.map((s: any) => ({
      id: s.videoId,
      imgUrl: `https://i.ytimg.com/vi/${s.videoId}/maxresdefault.jpg`,
    }));
    const total = res.data.stats_aggregate.aggregate.count;

    return {
      watched,
      total,
    };
  }
  return undefined;
}
