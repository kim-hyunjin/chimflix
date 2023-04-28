import jwt from 'jsonwebtoken';

// only can use server-side
export const createJwtToken = (issuer: string) => {
  const token = jwt.sign(
    {
      issuer,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000 + 7 * 24 * 60 * 60),
      'https://hasura.io/jwt/claims': {
        'x-hasura-allowed-roles': ['user', 'admin'],
        'x-hasura-default-role': 'user',
        'x-hasura-user-id': `${issuer}`,
      },
    },
    String(process.env.JWT_SECRET)
  );

  return token;
};
