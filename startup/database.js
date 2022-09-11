import mongoose from 'mongoose'
import logger from '../startup/logger.js'

mongoose.connect('mongodb://localhost:27017/test', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
})
.then(()=>{
    logger.info('Connected to MongoDB')
})
.catch((err) => {
    logger.error('Problem connecting to MongoDB.', err.message)
    process.exit(1)
})
