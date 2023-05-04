import cookie from 'cookie';
import type { NextApiResponse } from 'next';

const MAX_AGE = 7 * 24 * 60 * 60;

export const setTokenCookie = (token: string, res: NextApiResponse) => {
  const serializedCookie = cookie.serialize('token', token, {
    maxAge: MAX_AGE,
    expires: new Date(Date.now() + MAX_AGE * 1000),
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  });

  res.setHeader('Set-Cookie', serializedCookie);
};

export const removeTokenCookie = () => {
  const val = cookie.serialize('token', '', {
    maxAge: -1,
    path: '/',
  });
  if (document) {
    document.cookie = val;
  }
};

export const checkTokenExist = () => {
  if (typeof document === 'undefined') return false;

  const token = cookie.parse(document.cookie).token;

  return !!token;
};
