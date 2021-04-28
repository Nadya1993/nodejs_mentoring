import express from 'express';
import { UserServiceInstance } from '../services/UserService';

const router = express.Router();

router.get('/getSuggestionList', async (req: express.Request, res: express.Response) => {
  const { limit, loginSubstring } = req.query;
  const suggestionList = await UserServiceInstance.getSuggestionList(Number(limit), String(loginSubstring));

  res.json(suggestionList);
});

export default router;
