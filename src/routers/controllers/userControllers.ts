import express from 'express';
import { LIMIT_NOT_PASSED, LOGIN_SUBSTRING_NOT_PASSED, USER_ID_NOT_PASSED, USER_NOT_FOUND } from '../../locale';
import { UserServiceInstance } from '../../services/UserService';
import { reduceErrorResponse, schema } from '../../utils/userValidation';

export const getAllUsers = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.json(await UserServiceInstance.getUsers());
  res.locals.method = UserServiceInstance.getUsers.name;
  next();
};

export const deletUserById = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const removalId = req.body.delete;
  if (!removalId) {
    res.status(400).json(USER_ID_NOT_PASSED);
    return next();
  }
  const isUserDeleted = await UserServiceInstance.deleteUser(removalId);
  if (isUserDeleted) {
    res.sendStatus(200);
    res.locals.method = UserServiceInstance.deleteUser.name;
    res.locals.params = { removalId };
  } else {
    res.status(404).json(USER_NOT_FOUND);
  }
  next();
}

export const findUserById = async (req: express.Request, res: express.Response, next: express.NextFunction, userId: string) => {
  const requestedUser = await UserServiceInstance.findUser(userId);
  const notFound = userId && !requestedUser;

  if (notFound) {
    res.status(404).json(USER_NOT_FOUND);
    return;
  }

  res.locals.user = requestedUser;
  next();
}

export const provideFoundUser = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const user = res.locals.user;
  res.json(user);
  res.locals.method = UserServiceInstance.findUser.name;
  res.locals.params = { userId: user.dataValues.user_id };
  next();
}

export const getSuggestionList = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const { limit, loginSubstring } = req.query;

  if (!limit) {
    res.status(400).json(LIMIT_NOT_PASSED);
    return next();
  }

  if (!loginSubstring) {
    res.status(400).json(LOGIN_SUBSTRING_NOT_PASSED);
    return next();
  }

  const suggestionList = await UserServiceInstance.getSuggestionList(Number(limit), String(loginSubstring));

  res.json(suggestionList);
  res.locals.method = UserServiceInstance.getSuggestionList.name;
  res.locals.params = { limit, loginSubstring };
  next();
}

export const validateUser = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const { login, password, age } = req.body;
  const { error } = schema.validate({ login, password, age });

  if (error?.isJoi) {
    return res.status(400).json(reduceErrorResponse(error.details));
  }

  next();
}

export const addUser = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const { login, password, age } = req.body;

  await UserServiceInstance.addUser(login, password, Number(age));
  res.sendStatus(200);
  res.locals.method = UserServiceInstance.addUser.name;
  res.locals.params = { login, password, age };
  next();
}

export const updateUser = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const { login, password, age } = req.body;
  const { id } = req.params;
  await UserServiceInstance.updateUser({
    userId: id,
    login,
    password,
    age: Number(age),
  });
  res.sendStatus(200);
  res.locals.method = UserServiceInstance.updateUser.name;
  res.locals.params = { login, password, age };
  next();
}
