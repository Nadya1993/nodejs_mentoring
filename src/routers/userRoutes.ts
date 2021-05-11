import express from 'express';
import { UserServiceInstance } from '../services/UserService';
import { UserRes } from '../types';
import { schema, reduceErrorResponse } from '../utils/userValidation';

const router = express.Router();

// find all visible users
router.get('/', async (req: express.Request, res: express.Response) => {
  res.json(await UserServiceInstance.getUsers());
});

// delete user by id
router.delete('/', async (req: express.Request, res: express.Response) => {
  const isUserDeleted = await UserServiceInstance.deleteUser(req.body.delete);
  if (isUserDeleted) {
    res.sendStatus(200);
  } else {
    res.status(404).json('User was not found');
  }
});

// find user by id
router.get('/search', async (req: express.Request, res: express.Response) => {
  const userId = String(req.query.id);
  const requestedUser = await UserServiceInstance.findUser(userId);
  const notFound = userId && !requestedUser;
  if (notFound) {
    res.status(404).json('User was not found');
    return;
  }
  res.json(requestedUser);
});

// get list of suggestions
router.get('/getSuggestionList', async (req: express.Request, res: express.Response) => {
  const { limit, loginSubstring } = req.query;
  const suggestionList = await UserServiceInstance.getSuggestionList(Number(limit), String(loginSubstring));

  res.json(suggestionList);
});

// create user
router.use('/create', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const { login, password, age } = req.body;
  const { error } = schema.validate({ login, password, age });

  if (error?.isJoi) {
    return res.status(400).json(reduceErrorResponse(error.details));
  }

  next();
});

router.put('/create', async (req: express.Request, res: express.Response) => {
  const { login, password, age } = req.body;

  await UserServiceInstance.addUser(String(login), String(password), Number(age));
  res.sendStatus(200);
});

// update user
router.param('id', async (req: express.Request, res: UserRes, next: express.NextFunction, userId: string) => {
  const requestedUser = await UserServiceInstance.findUser(userId);
  res.user = requestedUser;
  next();
});

router.use('/:id', (req: express.Request, res: UserRes, next: express.NextFunction) => {
  const { login, password, age } = req.body;
  const { error } = schema.validate({ login, password, age });

  if (error?.isJoi) {
    return res.status(400).json(reduceErrorResponse(error.details));
  }

  next();
});

router.post('/:id', async (req: express.Request, res: UserRes) => {
  const { login, password, age } = req.body;
  const { id } = req.params;
  await UserServiceInstance.updateUser({
    userId: id,
    login: String(login),
    password: String(password),
    age: Number(age)
  });
  res.sendStatus(200);
});

export default router;
