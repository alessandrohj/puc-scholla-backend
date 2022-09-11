import express from 'express'
import morgan from 'morgan'
import logger from './startup/logger.js'
import authRouter from './routes/auth/index.js'
import database from './startup/database.js'

const app = express()
const log = logger.child({module: 'scholla:app'})
database()

log.info(process.env.NODE_ENV)
log.warn(app.get('env')) //if NODE_ENV is undefined, returns development

app.use(morgan('tiny'))
app.use(express.json())

app.get('/', (req, res) => {
    res.send({data: {healthStatus: 'Running'}})
})
app.use('/auth', authRouter)

export default app