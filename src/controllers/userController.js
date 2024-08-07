import { StatusCodes } from 'http-status-codes'
import { userService } from '~/services/userService'

const createNew = async (req, res, next) => {
  try {
    const createUser = await userService.createNew(req.body)

    res.status(StatusCodes.CREATED).json(createUser)
  } catch (error) { next(error) }
}
const verify = async (req, res, next) => {
  try {
    const { userId } = req.params
    const { OTP } = req.body
    const result = await userService.verify(userId, OTP)

    res.status(StatusCodes.OK).json(result)
  } catch (error) { next(error) }
}
const getWeather = async (req, res, next) => {
  try {
    const { userId, city, days } = req.params
    const weather = await userService.getWeather(userId, city, days)

    res.status(StatusCodes.OK).json(weather)
  } catch (error) { next(error) }
}

export const userController = {
  createNew,
  verify,
  getWeather
}