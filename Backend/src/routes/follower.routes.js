import express from 'express'

import { protectRoute } from '../middlewears/auth.middlewear.js';
import { sendingfollowingrequest, acceptrequest, rejectrequest, unfollowuser } from '../controllers/followercontrolling.js';

const router = express.Router();

router.post('/send-request',protectRoute, sendingfollowingrequest);
router.post('/accept-request', protectRoute, acceptrequest);
router.post('/reject-request', protectRoute, rejectrequest);

export default router