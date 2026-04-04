import express from 'express';
import { getLatestSpot } from '../controllers/spotController.js';

const router = express.Router();

router.get('/latest', getLatestSpot);

export { router };
