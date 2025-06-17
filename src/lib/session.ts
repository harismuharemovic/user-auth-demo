import { SessionOptions } from 'iron-session';

export const sessionOptions: SessionOptions = {
  cookieName: 'myapp_session',
  password: process.env.SECRET_COOKIE_PASSWORD as string,
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
};

declare module 'iron-session' {
  interface IronSessionData {
    user?: {
      id: number;
      email: string;
    };
  }
}
