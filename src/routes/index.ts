import express from 'express';
import { UserManager } from '../../utils/generateUsers';
import { UserRes } from '../types';
import { schema, reduceErrorResponse } from '../../utils/validation';

const router = express.Router();
const userManager = new UserManager(5);

router.get('/users', (req: express.Request, res: express.Response) => {
  res.json(userManager.getVisibleUsers());
});

router.post('/users', (req: express.Request, res: express.Response) => {
  const isUserDeleted = userManager.deleteUser(req.body.delete);
  if (isUserDeleted) {
    res.sendStatus(200);
  } else {
    res.status(404).json('User was not found');
  }
});

router.get('/users/search', (req: express.Request, res: express.Response) => {
  const userId = String(req.query.user_id);
  const requestedUser = userManager.findUser(userId);
  const notFound = userId && !requestedUser;
  if (notFound) {
    res.status(404).json('User was not found');
    return;
  }
  res.json(requestedUser);
});

router.put('/users/create', (req: express.Request, res: express.Response) => {
  const { login, password, age } = req.body;

  const { error } = schema.validate({ login, password, age });

  if (error?.isJoi) {
    res.status(400).json(reduceErrorResponse(error.details));
  } else {
    userManager.addUser(String(login), String(password), Number(age));
    res.sendStatus(200);
  }
});

router.param('id', (req: express.Request, res: UserRes, next: express.NextFunction, userId: string) => {
  const requestedUser = userManager.findUser(userId);
  res.user = requestedUser;
  next();
});

router.post('/users/:id', (req: express.Request, res: UserRes) => {
  const { login, password, age } = req.body;
  const { error } = schema.validate({ login, password, age });

  if (error?.isJoi) {
    res.status(400).json(reduceErrorResponse(error.details));
    return;
  }

  const { id } = req.params;
  userManager.updateUser({
    id,
    login: String(login),
    password: String(password),
    age: Number(age)
  });
  res.sendStatus(200);
});

router.get('/getSuggestionList', (req: express.Request, res: express.Response) => {
  const { limit, loginSubstring } = req.query;
  const suggestionList = userManager.getSuggestionList(Number(limit), String(loginSubstring));

  res.json(suggestionList);
});

export default router;
