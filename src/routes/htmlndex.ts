import express from 'express';
import { UserManager } from '../../utils/generateUsers';
import { UserRes } from '../types';
import { schema, reduceErrorResponse } from '../../utils/validation';

const router = express.Router();
const userManager = new UserManager(100);

router.get('/', (req: express.Request, res: express.Response) => {
  res.render('index');
});

router.get('/users', (req: express.Request, res: express.Response) => {
  res.render('users', {
    users: userManager.getVisibleUsers()
  });
});

router.post('/users', (req: express.Request, res: express.Response) => {
  userManager.deleteUser(req.body.delete);
  res.render('users', {
    users: userManager.getVisibleUsers()
  });
});

router.get('/users/search', (req: express.Request, res: express.Response) => {
  const userId = String(req.query.user_id);
  const requestedUser = userManager.findUser(userId);
  const notFound = userId && !requestedUser;

  res.render('get-user-form', {
    user: requestedUser,
    notFound: notFound && 'User was not found'
  });
});

router.post('/users/create', (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const { login, password, age } = req.body;

  const { error } = schema.validate({ login, password, age });

  if (error?.isJoi) {
    res.status(400).json(reduceErrorResponse(error.details));
    return;
  }
  userManager.addUser(String(login), String(password), Number(age));
  res.redirect('/users');
});

router.get('/users/create', (req: express.Request, res: express.Response) => {
  res.render('createUserForm');
});

router.param('id', (req: express.Request, res: UserRes, next: express.NextFunction, userId: string) => {
  const requestedUser = userManager.findUser(userId);
  res.user = requestedUser;
  next();
});

router.get('/users/:id', (req: express.Request, res: UserRes) => {
  res.render('createUserForm', {
    user: res.user
  });
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
    id: String(id),
    login: String(login),
    password: String(password),
    age: Number(age)
  });

  req.params = {};

  res.redirect('/users');
});

router.get('/getSuggestionList', (req: express.Request, res: express.Response) => {
  const { limit, loginSubstring } = req.query;
  const suggestionList = userManager.getSuggestionList(Number(limit), String(loginSubstring));

  res.send(suggestionList);
});

export default router;
