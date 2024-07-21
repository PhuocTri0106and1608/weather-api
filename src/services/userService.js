/* eslint-disable no-useless-catch */
import { userModel } from '~/models/userModel'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import axios from 'axios'

const createNew = async (reqBody) => {
  try {
    const email = reqBody
    const user = await userModel.findOneByEmail(email)
    if (user) {
      throw new ApiError(StatusCodes.CONFLICT, 'Email has been used!')
    }
    const createUser = await userModel.createNew(email)
    const getNewUser = await userModel.findOneById(createUser.insertedId)
    return getNewUser
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
  getWeather
}