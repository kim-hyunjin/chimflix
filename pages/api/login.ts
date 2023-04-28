import type { NextApiRequest, NextApiResponse } from 'next';
import { magicAdmin } from '../../lib/magic';
import { createNewUser, isNewUser } from '@/lib/db/hasura';
import { setTokenCookie } from '@/lib/cookies';
import { createJwtToken } from '@/lib/token';

export default async function login(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const auth = req.headers.authorization;
      const didToken = auth ? auth.substring(7) : '';
      if (didToken === '') {
        throw Error('need authorization value');
      }

      const { issuer, email } = await magicAdmin.users.getMetadataByToken(didToken);
      if (!email || !issuer) {
        throw Error('user data not found');
      }
      const token = createJwtToken(issuer);
      setTokenCookie(token, res);

      const newUser = await isNewUser(token, issuer);
      if (newUser) {
        await createNewUser(token, {
          email,
          issuer,
        });
      }

      res.send({ done: true });
    } catch (error) {
      console.error('Something went wrong logging in', error);
      res.status(500).send({ done: false });
    }
  } else {
    res.status(405).send({ done: false });
  }
}
