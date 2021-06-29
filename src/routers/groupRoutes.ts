import express from 'express';
import { addGroup, deleteGroupById, findAllGroups, findGroupById, provideFoundGroup, updateGroup, validateGroup } from './controllers/groupControllers';

const router = express.Router();

// find all groups
router.get('/', findAllGroups);

// delete group by id
router.delete('/', deleteGroupById);

// find group by id
router.param('id', findGroupById);
router.get('/search/:id', provideFoundGroup);

// create group
router
  .use('/create', validateGroup)
  .put('/create', addGroup);

// update group
router
  .use('/update/:id', validateGroup)
  .post('/update/:id', updateGroup);

export default router;
