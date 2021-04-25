import express from 'express';
import { UserModel } from '../models/UserModel';
import { UserService } from '../services/UserService';

const router = express.Router();
const UserServiceInstance = new UserService(UserModel);

router.get('/getSuggestionList', async (req: express.Request, res: express.Response) => {
  const { limit, loginSubstring } = req.query;
  const suggestionList = await UserServiceInstance.getSuggestionList(Number(limit), String(loginSubstring));

  res.json(suggestionList);
});

export default router;
