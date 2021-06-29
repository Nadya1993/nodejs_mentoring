import express from 'express';
import { addUser, deletUserById, findUserById, getAllUsers, getSuggestionList, provideFoundUser, updateUser, validateUser } from './controllers/userControllers';

const router = express.Router();

// find all visible users
router.get('/', getAllUsers);

// delete user by id
router.delete('/', deletUserById)

// find user by id
router.param('id', findUserById);
router.get('/search/:id', provideFoundUser);

// get list of suggestions
router.get('/getSuggestionList', getSuggestionList);

// create user
router
  .use('/create', validateUser)
  .put('/create', addUser);

// update user
router
  .use('/update/:id', validateUser)
  .post('/update/:id', updateUser);

export default router;
