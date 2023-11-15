import 'express';

declare module 'express' {
  interface Request {
    user: App.JwtPayload;
  }
}
