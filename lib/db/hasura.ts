import { Stats } from '@/types/hasura';

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
    }
  }

  mutation InsertStats($userId: String!, $videoId: String!) {
    insert_stats_one(object: {
      userId: $userId, 
      videoId: $videoId
      favourited: null, 
      watched: false, 
    }) {
      id
      userId
      videoId
      favourited
      watched
    }
  }

  mutation UpdateStats($favourited: Int, $userId: String!, $watched: Boolean!, $videoId: String!) {
    update_stats(
      _set: {watched: $watched, favourited: $favourited}, 
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
      }
    }
  }

  query WatchedVideos($userId: String!) {
    stats(where: {
      watched: {_eq: true}, 
      userId: {_eq: $userId},
    }) {
      videoId
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
  return await fetchGraphQL(
    operationsDoc,
    'InsertStats',
    {
      userId: issuer,
      videoId,
    },
    token
  );
}

export async function updateStats(
  token: string,
  metadata: {
    favourited: number | null;
    userId: string;
    watched: boolean;
    videoId: string;
  }
): Promise<Stats> {
  return await fetchGraphQL(operationsDoc, 'UpdateStats', metadata, token);
}

export async function getWatchedVideos(
  token: string,
  issuer: string
): Promise<string[] | undefined> {
  const res = await fetchGraphQL(
    operationsDoc,
    'WatchedVideos',
    {
      userId: issuer,
    },
    token
  );
  if (res?.data?.stats?.length > 0) {
    return res.data.stats.map((s: any) => s.videoId);
  }
  return undefined;
}
