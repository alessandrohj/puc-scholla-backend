import mongoose from 'mongoose'
import logger from './logger.js'
import config from 'config'

const log = logger.child({module: 'connectDB'})

export default async function connectDatabase () {
    const {scheme, host, port, name, authSource, username, password} = config.get('db')
    const credentials = username && password ? `${username}:${password}@` : ''
    let connectionString = `${scheme}://${credentials}${host}`
  
    if (scheme === 'mongodb') {
      connectionString += `:${port}/${name}?authSource=${authSource}`
    } else {
      connectionString += `/?retryWrites=true&w=majority`
    }
    
    try {
      await mongoose.connect(
        connectionString,
        {
          useNewUrlParser: true,
          dbName: name
        }
      )
      log.info(`Connected to MongoDB @ ${name}...`)
    } catch(err) {
      log.error(`Error connecting to MongoDB ...`, err)
      process.exit(1)
    }
  }