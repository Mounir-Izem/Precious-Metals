import express from 'express'
import * as healthController from '../controllers/healthController.js'

const router = express.Router()

router.get('/', healthController.getHealth)
router.get('/ready', healthController.checkHealth)

export { router }


