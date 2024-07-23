import clientManager from '../clientManager.mjs'
import modelHelper from '../lib/modelHelper.mjs'
import OpensearchError from '../OpensearchError.mjs'
import {
  CREATE_INDEX_ERROR,
  REMOVE_INDEX_ERROR,
  INDEX_EXISTS_ERROR,
  UPDATE_SCHEMA_ERROR,
  UPDATE_SETTINGS_ERROR,
  CLOSE_INDEX_ERROR,
  OPEN_INDEX_ERROR
} from '../ERRORS.mjs'

const indicesModel = {
  createIndices,
  removeIndices,
  indicesExists,
  updateSchema,
  updateSettings,
  closeIndices,
  openIndices
}

export default indicesModel

async function createIndices() {
  try {
    const { Schema } = this
    const params = modelHelper.buildIndicesParams(Schema, 'create')
    const client = clientManager.getPersistentClient()
    await client.indices.create(params)
  } catch (error) {
    throw new OpensearchError(error, CREATE_INDEX_ERROR)
  }
}

async function removeIndices() {
  try {
    const { Schema } = this
    const params = modelHelper.buildIndicesParams(Schema, 'delete')
    const client = clientManager.getPersistentClient()
    await client.indices.delete(params, REMOVE_INDEX_ERROR)
  } catch (error) {
    throw new OpensearchError(error)
  }
}

async function indicesExists() {
  try {
    const { Schema } = this

    const { index } = Schema
    const params = { index }
    const clientOptions = { ignore: [404] }
    const client = clientManager.getPersistentClient()

    const response = await client.indices.exists(params, clientOptions)
    const { statusCode } = response

    if (statusCode === 404) {
      return { indicesExist: false }
    }

    return { indicesExist: true }
  } catch (error) {
    throw new OpensearchError(error, INDEX_EXISTS_ERROR)
  }
}

async function updateSchema() {
  try {
    const { Schema } = this
    const params = modelHelper.buildIndicesParams(Schema, 'updateSchema')
    const client = clientManager.getPersistentClient()
    await client.indices.putMapping(params)
  } catch (error) {
    throw new OpensearchError(error, UPDATE_SCHEMA_ERROR)
  }
}

async function updateSettings() {
  try {
    const { Schema } = this
    const params = modelHelper.buildIndicesParams(Schema, 'updateSettings')
    const client = clientManager.getPersistentClient()
    await client.indices.putSettings(params)
  } catch (error) {
    throw new OpensearchError(error, UPDATE_SETTINGS_ERROR)
  }
}

async function closeIndices() {
  try {
    const { Schema } = this
    const params = modelHelper.buildIndicesParams(Schema, 'close')
    const client = clientManager.getPersistentClient()
    await client.indices.close(params)
  } catch (error) {
    throw new OpensearchError(error, CLOSE_INDEX_ERROR)
  }
}

async function openIndices() {
  try {
    const { Schema } = this
    const params = modelHelper.buildIndicesParams(Schema, 'open')
    const client = clientManager.getPersistentClient()
    await client.indices.open(params)
  } catch (error) {
    throw new OpensearchError(error, OPEN_INDEX_ERROR)
  }
}
