import express from 'express'
import * as spotController from '../controllers/spotController.js'

const router = express.Router()

router.get('/variation', spotController.getLatestSpot)
router.get('/latest', spotController.getTodaySpot)

export { router }
