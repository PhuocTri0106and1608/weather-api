import express from 'express'
import axios from 'axios'
import { StatusCodes } from 'http-status-codes'
import { userRoute } from './userRoute'

const Router = express.Router()

Router.get('/status', (req, res) => {
  res.status(StatusCodes.OK).json({ message: 'APIs V1 are ready to use.' })
})
Router.get('/weather/:city/:days', async (req, res) => {
  try {
    const { city, days } = req.params
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
    const weather = {
      todayWeather: todayWeather,
      futureWeather: futureWeather
    }
    res.status(StatusCodes.OK).json({ weather })
  } catch (error) { throw error }
})

Router.use('/users', userRoute)

export const APIs_V1 = Router