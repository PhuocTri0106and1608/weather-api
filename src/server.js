/* eslint-disable no-console */
import express from 'express'
import cors from 'cors'
import { corsOptions } from '~/config/cors'
import exitHook from 'async-exit-hook'
import { CLOSE_DB, CONNECT_DB } from '~/config/mongodb'
import { env } from '~/config/environment'
import { APIs_V1 } from '~/routes/v1'
import { errorHandlingMiddleware } from './middlewares/errorHandlingMiddleware'

const START_SERVER = () => {
  const app = express()

  app.use(cors(corsOptions))

  app.use(express.json())
  app.use('/v1', APIs_V1)

  //Middleware xử lý lỗi tập trung
  app.use(errorHandlingMiddleware)

  if (env.BUILD_MODE === 'production') {
    app.listen(process.env.PORT, () => {
      console.log(`3. Production: Hi ${env.AUTHOR}, Server is running at Port: ${process.env.PORT}`)
    })
  } else {
    app.listen(env.LOCAL_DEV_APP_PORT, env.LOCAL_DEV_APP_HOST, () => {
      console.log(`3. Local DEV: Hi ${env.AUTHOR}, Server is running at http://${env.LOCAL_DEV_APP_HOST}:${env.LOCAL_DEV_APP_PORT}/`)
    })
  }
  //Clean up trước khi close
  exitHook(() => {
    CLOSE_DB()
    console.log('4. Disconnected from MongoDB Cloud Atlas')
  })
}

// Immediately-invoked / Anonymous Async Function (IIFE)
(async () => {
  try {
    console.log('1. Connecting to MongoDB Cloud Atlas...')
    await CONNECT_DB()
    console.log('2. Connected to MongoDB Cloud Atlas!')
    START_SERVER()
  } catch (error) {
    console.error(error)
    process.exit(0)
  }
})()