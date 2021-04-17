import express from 'express';
import { userManagerInstance } from '../models/UserModel';

const router = express.Router();

router.get('/getSuggestionList', (req: express.Request, res: express.Response) => {
  const { limit, loginSubstring } = req.query;
  const suggestionList = userManagerInstance.getSuggestionList(Number(limit), String(loginSubstring));

  res.json(suggestionList);
});

export default router;
