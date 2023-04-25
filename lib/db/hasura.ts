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
      returning {
        email
        issuer
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
