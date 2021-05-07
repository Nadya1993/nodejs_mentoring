import express from 'express';
import { GroupServiceInstance } from '../services/GroupService';
import { GroupRes } from '../types';

const router = express.Router();

// find all groups
router.get('/', async (req: express.Request, res: express.Response) => {
  res.json(await GroupServiceInstance.getGroups());
});

// delete group by id
router.post('/', async (req: express.Request, res: express.Response) => {
  const isGroupDeleted = await GroupServiceInstance.deleteGroup(req.body.delete);
  if (isGroupDeleted) {
    res.sendStatus(200);
  } else {
    res.status(404).json('Group was not found');
  }
});

// find group by id
router.get('/search', async (req: express.Request, res: express.Response) => {
  const groupId = String(req.query.id);
  const requestedGroup = await GroupServiceInstance.findGroup(groupId);
  const notFound = groupId && !requestedGroup;
  if (notFound) {
    res.status(404).json('Group was not found');
    return;
  }
  res.json(requestedGroup);
});

router.put('/create', async (req: express.Request, res: express.Response) => {
  const { name, permission } = req.body;

  await GroupServiceInstance.addGroup(String(name), permission);
  res.sendStatus(200);
});

// update group
router.param('id', async (req: express.Request, res: GroupRes, next: express.NextFunction, groupId: string) => {
  const requestedGroup = await GroupServiceInstance.findGroup(groupId);
  res.group = requestedGroup;
  next();
});

router.post('/:id', async (req: express.Request, res: GroupRes) => {
  const { name, permission } = req.body;
  const { id } = req.params;
  await GroupServiceInstance.updateGroup({
    groupId: id,
    name: String(name),
    permission
  });
  res.sendStatus(200);
});

export default router;
