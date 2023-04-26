import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

export default async function stats(req: NextApiRequest, resp: NextApiResponse) {
  if (req.method === 'POST') {
    console.log({ cookies: req.cookies });

    try {
      const token = req.cookies.token;
      if (!token) {
        resp.status(403).send({});
      } else {
        const decoded = jwt.verify(token, String(process.env.JWT_SECRET));
        console.log({ decoded });
        resp.send({ msg: 'it works' });
      }
    } catch (error: any) {
      console.error('Error occurred /stats', error);
      resp.status(500).send({ done: false, error: error?.message });
    }
  }
}
