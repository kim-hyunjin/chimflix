import type { NextApiRequest, NextApiResponse } from 'next';
import { magicAdmin } from '../../lib/magic';
import jwt from 'jsonwebtoken';
import { createNewUser, isNewUser } from '@/lib/db/hasura';
import { setTokenCookie } from '@/lib/cookies';

export default async function login(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const auth = req.headers.authorization;
      const didToken = auth ? auth.substring(7) : '';
      if (didToken === '') {
        throw Error('need authorization value');
      }

      const metadata = await magicAdmin.users.getMetadataByToken(didToken);
      if (!metadata.email || !metadata.issuer) {
        throw Error('user data not found');
      }
      const token = jwt.sign(
        {
          ...metadata,
          iat: Math.floor(Date.now() / 1000),
          exp: Math.floor(Date.now() / 1000 + 7 * 24 * 60 * 60),
          'https://hasura.io/jwt/claims': {
            'x-hasura-allowed-roles': ['user', 'admin'],
            'x-hasura-default-role': 'user',
            'x-hasura-user-id': `${metadata.issuer}`,
          },
        },
        String(process.env.JWT_SECRET)
      );

      const newUser = await isNewUser(token, metadata.issuer);
      if (newUser) {
        await createNewUser(token, {
          email: metadata.email,
          issuer: metadata.issuer,
        });
      }
      setTokenCookie(token, res);

      res.send({ done: true });
    } catch (error) {
      console.error('Something went wrong logging in', error);
      res.status(500).send({ done: false });
    }
  } else {
    res.status(405).send({ done: false });
  }
}
