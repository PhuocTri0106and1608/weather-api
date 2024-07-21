import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'

const USER_COLLECTION_NAME = 'users'
const USER_COLLECTION_SCHEMA = Joi.object({
  email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
  isConfirmed: Joi.boolean().default(false),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})

const validateBeforeCreate = async (data) => {
  return await USER_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
  try {
    const validData = await validateBeforeCreate(data)

    const createUser = await GET_DB().collection(USER_COLLECTION_NAME).insertOne(validData)
    return createUser
  } catch (error) { throw new Error(error) }
}

const findOneById = async (id) => {
  try {
    const result = await GET_DB().collection(USER_COLLECTION_NAME).findOne({
      _id: new ObjectId(`${id}`)
    })
    return result
  } catch (error) { throw new Error(error) }
}
const findOneByEmail = async (reqBody) => {
  try {
    const result = await GET_DB().collection(USER_COLLECTION_NAME).findOne({
      email: reqBody.email
    })
    return result
  } catch (error) { throw new Error(error) }
}

export const userModel = {
  USER_COLLECTION_NAME,
  USER_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  findOneByEmail
}