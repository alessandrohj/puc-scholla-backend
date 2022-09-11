import http from 'http'
import app from './app.js'
import logger from './startup/logger.js'

const log = logger.child({module: 'scholla:httpServer'})
const httpServer = http.createServer(app)
const port = process.env.PORT || 3000

httpServer.listen(port, () => {
    log.info(`HTTP server listening on port ${httpServer.address().port}`)
})
