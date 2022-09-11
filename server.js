import http from 'http'
import app from './app.js'

const httpServer = http.createServer(app)
const port = process.env.PORT || 3000

httpServer.listen(port, () => {
    console.log(`server running on port ${port}`)
})
