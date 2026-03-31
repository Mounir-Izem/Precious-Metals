import express from 'express'
import { router as healthRouter } from './routes/health.js'
import { router as spotRouter } from './routes/spot.js'
import helmet from 'helmet'
import cors from 'cors'
import expressRateLimit from 'express-rate-limit'

const app = express();

app.use(cors());
app.use(express.json())
app.use(helmet());

const limiter = expressRateLimit({
    windowMs: 900000,
    max: 100
})

app.use(limiter)

app.use('/health', healthRouter);

app.use('/spot', spotRouter);

export default app