import express from 'express';

import { createReminder } from '../controllers/reminderControllers.js';
import { getUserReminder } from '../controllers/reminderControllers.js';
import { getSharedReminders } from '../controllers/reminderControllers.js';
import { getUserArchivedReminders } from '../controllers/reminderControllers.js';
import { updateReminder } from '../controllers/reminderControllers.js';
import { softDeleteReminder } from '../controllers/reminderControllers.js';
import { shareReminder } from '../controllers/reminderControllers.js';

const router = express.Router();
router.post('/', createReminder);
router.get('/user/:id', getUserReminder);
router.get('/shared/:id', getSharedReminders);
router.get('/archived/:id', getUserArchivedReminders);
router.put('/:id', updateReminder);
router.delete('/:id', softDeleteReminder);
router.post('/share', shareReminder);

export default router;