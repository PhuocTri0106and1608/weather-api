/* eslint-disable no-useless-catch */
import { StatusCodes } from 'http-status-codes'
import bcrypt from 'bcrypt'
import axios from 'axios'
import { generateOTP, mailTransport, OtpTemplate, verifiedTemplate } from '~/utils/mail'
import { tokenModel } from '~/models/tokenModel'
import { userModel } from '~/models/userModel'
import ApiError from '~/utils/ApiError'
import { env } from '~/config/environment'

const createNew = async (reqBody) => {
  try {
    const email = reqBody
    const user = await userModel.findOneByEmail(email)
    if (user) {
      throw new ApiError(StatusCodes.CONFLICT, 'Email has been used!')
    }
    const createUser = await userModel.createNew(email)
    const getNewUser = await userModel.findOneById(createUser.insertedId)
    const OTP = generateOTP()
    const hashToken = await bcrypt.hash(OTP, 8)
    await tokenModel.createNew({
      userId: getNewUser._id.toString(),
      token: hashToken
    })
    mailTransport().sendMail({
      from: env.MAILTRAP_USERNAME,
      to: getNewUser.email,
      subject: 'OTP to verify your email',
      html: OtpTemplate(OTP)
    })
    return getNewUser
  } catch (error) { throw error }
}
const verify = async (userId, OTP) => {
  try {
    const user = await userModel.findOneById(userId)
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found!!')
    }
    const existedToken = await tokenModel.findOneByUserId(userId)
    if (!existedToken) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Token not found!!')
    }
    const isMatched = await tokenModel.compare(OTP, existedToken.token)
    if (!isMatched) throw ApiError(StatusCodes.BAD_REQUEST, 'Please provide a valid OTP!')
    await tokenModel.deleteOneById(existedToken._id)
    await userModel.update(user._id, { isVerified: true })
    mailTransport().sendMail({
      from: env.MAILTRAP_USERNAME,
      to: user.email,
      subject: 'Verify your email account successfully',
      html: verifiedTemplate()
    })
    return { message: 'Verify your email account successfully!' }
  } catch (error) { throw error }
}
const getWeather = async (userId, city, days) => {
  try {
    const user = await userModel.findOneById(userId)
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'user not found!')
    }
    const response = await axios.get(`${process.env.WEATHER_API_ROOT}?key=${process.env.WEATHER_API_KEY}&q=${city}&days=${days}&aqi=yes&alerts=yes`)
    const todayWeather = {
      location: response.data.location.name,
      time: response.data.location.localtime,
      temperature: response.data.current.temp_c,
      wind: response.data.current.wind_mph,
      humidity: response.data.current.humidity,
      text: response.data.current.condition.text,
      icon: response.data.current.condition.icon
    }
    const futureWeather = response.data.forecast.forecastday.map(item => (
      {
        time: item.date,
        temperature: item.day.avgtemp_c,
        wind: item.day.maxwind_mph,
        humidity: item.day.avghumidity,
        text: item.day.condition.text,
        icon: item.day.condition.icon
      }
    )).slice(1)
    const result = {
      ...user,
      weather: {
        todayWeather: todayWeather,
        futureWeather: futureWeather
      }
    }
    return result
  } catch (error) { throw error }
}
export const userService = {
  createNew,
  verify,
  getWeather
}