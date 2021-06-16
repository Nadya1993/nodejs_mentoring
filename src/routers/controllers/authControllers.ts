import express from 'express';
import { UserServiceInstance } from '../../services/UserService';
import { generateToken } from '../../utils/generateToken';
import jwt from 'jsonwebtoken';

const secret = process.env.SECRET;

export const authenticate = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const { login, password } = req.body;
  if (!login || !password) {
    next('No login/password provided');
  }
  const user = await UserServiceInstance.findUserByLogin(login);

  if (!user || user.password !== password) {
    res.locals.method = UserServiceInstance.findUserByLogin.name;
    res.locals.params = { login };
    res.status(403).json('Bad login/password combination');
  } else {
    const token = generateToken(user.userId);
    res.json(token);
  }
  next();
}

export const checkToken = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const token = req.headers.authorization;

  if (token) {
    jwt.verify(token, secret, (error, decoded) => {
      if (error) {
        res.status(403).json('Failed to authenticate token');
        return;
      }
      next();
    })
  } else {
    res.status(401).json('No token provided');
  }
}

export const refreshToken = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const token = req.headers.authorization;

  if (token) {
    jwt.verify(token, secret, (error, decoded: any) => {
      if (error) {
        res.status(401).json('Failed to authenticate token');
        return;
      }
      // example of decoded token
      // {
      //   sub: 'ba40f2aa-2045-4ea2-9c53-de0ed3ad6b45',
      //   iat: 1622970041,
      //   exp: 1622970401
      // };
      const token = generateToken(decoded.sub);
      res.json(token);
    })
  } else {
    res.status(403).json('No token provided');
  }
}
