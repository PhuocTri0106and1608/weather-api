import express from 'express'
// import { userValidation } from '~/validations/userValidation'
import { userController } from '~/controllers/userController'

const Router = express.Router()

Router.route('/')
  .post(userController.createNew)

Router.route('/verify/:userId')
  .post(userController.verify)

Router.route('/weather/:userId/:city/:days')
  .get(userController.getWeather)


export const userRoute = Router