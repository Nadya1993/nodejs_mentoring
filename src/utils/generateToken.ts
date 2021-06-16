import jwt from 'jsonwebtoken';

const secret = process.env.SECRET;

export const generateToken = (sub: string) => {
  const payload = { sub };
  const token = jwt.sign(payload, secret, { expiresIn: 360 });

  return token;
};
