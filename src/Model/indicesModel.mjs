import clientManager from '../clientManager.mjs'
import modelHelper from '../lib/modelHelper.mjs'
import OpensearchError from '../OpensearchError.mjs'
import {
  CREATE_INDEX_ERROR,
  REMOVE_INDEX_ERROR,
  INDEX_EXISTS_ERROR
} from '../ERRORS.mjs'

const indicesModel = {
  createIndices,
  removeIndices,
  indicesExists
}

export default indicesModel

async function createIndices () {
  try {
    const { Schema } = this
    const params = modelHelper.buildIndicesParams(Schema, 'create')
    const client = clientManager.getPersistentClient()
    await client.indices.create(params)
  } catch (error) {
    throw new OpensearchError(error, CREATE_INDEX_ERROR)
  }
}

async function removeIndices () {
  try {
    const { Schema } = this
    const params = modelHelper.buildIndicesParams(Schema, 'delete')
    const client = clientManager.getPersistentClient()
    await client.indices.delete(params, REMOVE_INDEX_ERROR)
  } catch (error) {
    throw new OpensearchError(error)
  }
}

async function indicesExists () {
  try {
    const { Schema } = this

    const { index } = Schema
    const params = { index }
    const clientOptions = { ignore: [404] }
    const client = clientManager.getPersistentClient()

    const response = await client.indices.exists(params, clientOptions)
    const { statusCode } = response

    if (statusCode === 404) { return { indicesExist: false } }

    return { indicesExist: true }
  } catch (error) {
    throw new OpensearchError(error, INDEX_EXISTS_ERROR)
  }
}
