import express from 'express';
import { addGroup, deleteGroupById, findAllGroups, findGroupById, provideFoundGroup, updateGroup } from './controllers/groupControllers';

const router = express.Router();

// find all groups
router.get('/', findAllGroups);

// delete group by id
router.delete('/', deleteGroupById);

// find group by id
router.param('id', findGroupById);

router.get('/search/:id', provideFoundGroup);

// create group
router.put('/create', addGroup);

// update group
router.post('update/:id', updateGroup);

export default router;
