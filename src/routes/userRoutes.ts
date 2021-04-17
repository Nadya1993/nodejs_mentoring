import express from 'express';
import { userManagerInstance } from '../models/UserModel';
import { UserRes } from '../types';
import { schema, reduceErrorResponse } from '../utils/userValidation';

const router = express.Router();

// find all visible users
router.get('/', (req: express.Request, res: express.Response) => {
  res.json(userManagerInstance.getVisibleUsers());
});

// delete user by id
router.post('/', (req: express.Request, res: express.Response) => {
  const isUserDeleted = userManagerInstance.deleteUser(req.body.delete);
  if (isUserDeleted) {
    res.sendStatus(200);
  } else {
    res.status(404).json('User was not found');
  }
});

// find user by id
router.get('/search', (req: express.Request, res: express.Response) => {
  const userId = String(req.query.user_id);
  const requestedUser = userManagerInstance.findUser(userId);
  const notFound = userId && !requestedUser;
  if (notFound) {
    res.status(404).json('User was not found');
    return;
  }
  res.json(requestedUser);
});

// create user
router.put('/create', (req: express.Request, res: express.Response) => {
  const { login, password, age } = req.body;

  const { error } = schema.validate({ login, password, age });

  if (error?.isJoi) {
    res.status(400).json(reduceErrorResponse(error.details));
  } else {
    userManagerInstance.addUser(String(login), String(password), Number(age));
    res.sendStatus(200);
  }
});

// update user
router.param('id', (req: express.Request, res: UserRes, next: express.NextFunction, userId: string) => {
  const requestedUser = userManagerInstance.findUser(userId);
  res.user = requestedUser;
  next();
});

router.use('/:id', (req: express.Request, res: UserRes, next: express.NextFunction) => {
  const { login, password, age } = req.body;
  const { error } = schema.validate({ login, password, age });

  if (error?.isJoi) {
    res.status(400).json(reduceErrorResponse(error.details));
    return;
  }

  next();
});

router.post('/:id', (req: express.Request, res: UserRes) => {
  const { login, password, age } = req.body;
  const { id } = req.params;
  userManagerInstance.updateUser({
    id,
    login: String(login),
    password: String(password),
    age: Number(age)
  });
  res.sendStatus(200);
});

export default router;
