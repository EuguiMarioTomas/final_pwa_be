import express from 'express';

import { createUser } from '../controllers/userControllers.js';
import { getUserByFirebaseUid } from '../controllers/userControllers.js';
import { getUserById } from '../controllers/userControllers.js';
import { updateUser } from '../controllers/userControllers.js';

const router = express.Router();
router.post('/', createUser);
router.get('/firebase/:firebaseUid', getUserByFirebaseUid);
router.get('/:id', getUserById);
router.put('/:id', updateUser);


export default router;