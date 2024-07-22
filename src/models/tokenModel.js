import Joi from 'joi'
import bcrypt from 'bcrypt'
import { GET_DB } from '~/config/mongodb'
import { ObjectId } from 'mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

const TOKEN_COLLECTION_NAME = 'tokens'
const TOKEN_COLLECTION_SCHEMA = Joi.object({
  userId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  token: Joi.string().required(),
  createdAt: Joi.date().timestamp('javascript').default(Date.now)
})

const validateBeforeCreate = async (data) => {
  return await TOKEN_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
  try {
    const validData = await validateBeforeCreate(data)

    const createToken = await GET_DB().collection(TOKEN_COLLECTION_NAME).insertOne({
      ...validData,
      userId: new ObjectId(`${validData.userId}`)
    })
    return createToken
  } catch (error) { throw new Error(error) }
}
const findOneByUserId = async (userId) => {
  try {
    const result = await GET_DB().collection(TOKEN_COLLECTION_NAME).findOne({
      userId: new ObjectId(`${userId}`)
    })
    return result
  } catch (error) { throw new Error(error) }
}
const compare = async (token, existedToken) => {
  try {
    const result = bcrypt.compareSync(token, existedToken)
    return result
  } catch (error) { throw new Error(error) }
}
const deleteOneById = async (id) => {
  try {
    const result = await GET_DB().collection(TOKEN_COLLECTION_NAME).deleteOne({
      _id: new ObjectId(`${id}`)
    })
    return result
  } catch (error) { throw new Error(error) }
}

export const tokenModel = {
  TOKEN_COLLECTION_NAME,
  TOKEN_COLLECTION_SCHEMA,
  createNew,
  findOneByUserId,
  compare,
  deleteOneById
}