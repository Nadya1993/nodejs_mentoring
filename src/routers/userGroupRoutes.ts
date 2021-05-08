import express from 'express';
import { UserGroupServiceInstance } from '../services/UserGroupService';

const router = express.Router();

// add users to group
router.put('/addUsers', async (req: express.Request, res: express.Response) => {
  const { groupId, userIds } = req.body;

  const result = await UserGroupServiceInstance.addUsersToGroup(groupId, userIds.split(','));
  if (result) {
    res.sendStatus(200);
  } else {
    res.sendStatus(500);
  }
});

export default router;
