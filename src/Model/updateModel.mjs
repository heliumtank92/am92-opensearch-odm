import _ from 'lodash'
import clientManager from '../clientManager.mjs'
import modelHelper from '../lib/modelHelper.mjs'
import utils from '../lib/utils.mjs'

import OpensearchError from '../OpensearchError.mjs'
import {
  UPDATE_BY_ID_ERROR,
  FIND_ONE_AND_UPDATE_ERROR,
  FIND_MANY_AND_UPDATE_ERROR,
  UPDATE_BY_QUERY_ERROR
} from '../ERRORS.mjs'

const updateModel = {
  updateOne,
  updateMany,
  updateById,
  updateOneBy,
  updateManyBy,
  updateByQuery,

  findOneAndUpdate,
  findManyAndUpdate
}

export default updateModel

async function updateOne(
  query = {},
  updateObj = {},
  projection = {},
  options = {}
) {
  const instance = await this.findOneAndUpdate(
    query,
    updateObj,
    projection,
    options
  )
  return instance
}

async function updateMany(
  query = {},
  updateObj = {},
  projection = {},
  options = {}
) {
  const instance = await this.findManyAndUpdate(
    query,
    updateObj,
    projection,
    options
  )
  return instance
}

async function updateById(id, updateObj = {}, projection = {}, options = {}) {
  const { Schema } = this
  const { index } = Schema

  if (updateObj?.id && updateObj.id !== id) {
    throw new OpensearchError(
      { message: "'Id' does not match" },
      UPDATE_BY_ID_ERROR
    )
  }

  try {
    const instanceAttrs = { ...updateObj, id }
    const updateInstance = Schema.instantiate(instanceAttrs, 'update')
    const projectionOptions = modelHelper.buildProjections(projection)
    const params = {
      refresh: 'true',
      index,
      id,
      body: {
        detect_noop: false,
        ...options,
        doc: updateObj ? updateInstance : undefined
      },
      _source: true,
      ...projectionOptions
    }

    const client = clientManager.getPersistentClient()
    const response = await client.update(params)
    const { body } = response
    const { get: { _source: document } = {} } = body
    return document
  } catch (error) {
    throw new OpensearchError(error, UPDATE_BY_ID_ERROR)
  }
}

async function updateOneBy(
  key = '',
  value,
  updateObj = {},
  projection = {},
  options = {}
) {
  const query = { match: { [key]: value } }
  const instance = await this.updateOne(query, updateObj, projection, options)
  return instance
}

async function updateManyBy(
  key = '',
  value,
  updateObj = {},
  projection = {},
  options = {}
) {
  const query = { match: { [key]: value } }
  const instance = await this.updateMany(query, updateObj, projection, options)
  return instance
}

async function updateByQuery(esBody = {}, options = {}) {
  try {
    const { Schema } = this
    const { index } = Schema

    const { clientOptions = {}, paramOptions = {}, bodyOptions = {} } = options

    const clientOpts = {
      ignore: [404],
      ...clientOptions
    }

    const params = {
      ...paramOptions,
      index,
      body: { ...esBody, ...bodyOptions }
    }

    const client = clientManager.getPersistentClient()

    const response = await client.updateByQuery(params, clientOpts)
    return response
  } catch (error) {
    throw new OpensearchError(error, FIND_MANY_AND_UPDATE_ERROR)
  }
}

async function findOneAndUpdate(
  query = {},
  updateObj = {},
  projection = {},
  options = {}
) {
  try {
    const findProjection = { id: 1 }

    const {
      clientOptions = {},
      paramOptions = {},
      updateOptions = {}
    } = options
    const clientOpts = { ...clientOptions, ignore: undefined }
    const findOptions = { paramOptions, clientOptions: clientOpts }

    const instance = await this.findOne(query, findProjection, findOptions)

    if (!instance) {
      const error = new Error('No Document Found with Query')
      error.statusCode = 404
      error.query = query
      throw error
    }

    const { id } = instance
    const updatedInstace = await this.updateById(
      id,
      updateObj,
      projection,
      updateOptions
    )
    return updatedInstace
  } catch (error) {
    throw new OpensearchError(error, FIND_ONE_AND_UPDATE_ERROR)
  }
}

async function findManyAndUpdate(
  query = {},
  updateObj = {},
  projection = {},
  options = {}
) {
  try {
    const { Schema } = this
    const findProjection = _.isEmpty(projection) ? {} : { ...projection, id: 1 }

    const { clientOptions = {}, paramOptions = {} } = options
    const clientOpts = { ...clientOptions, ignore: undefined }
    const findOptions = { paramOptions, clientOptions: clientOpts }

    const instances = await this.findMany(query, findProjection, findOptions)

    if (_.isEmpty(instances)) {
      const error = new Error('No Document Found with Query')
      error.statusCode = 404
      error.query = query
      throw error
    }

    const updateDocs = _.map(instances, instance =>
      utils.mergeObjs(instance, updateObj)
    )
    const response = _bulkUpdate(Schema, updateDocs)
    return response
  } catch (error) {
    throw new OpensearchError(error, FIND_MANY_AND_UPDATE_ERROR)
  }
}

async function _bulkUpdate(Schema, attrs = []) {
  const { index } = Schema
  const reqBody = _.reduce(
    attrs,
    (array, document) => {
      const instance = Schema.instantiate(document, 'update')
      // Add Action
      array.push({
        update: { _index: index, _id: document.id }
      })
      // Add Doucument
      array.push({ doc: instance })
      return array
    },
    []
  )

  const client = clientManager.getPersistentClient()

  const response = await client.bulk({
    index,
    body: reqBody,
    refresh: true,
    _source: true
  })

  const { body = {} } = response
  const { items = [] } = body

  const responseBody = {
    items: [],
    errors: [],
    hasError: false
  }

  _.each(items, (responseRecord, index) => {
    const operation = Object.keys(responseRecord)[0]
    const item = responseRecord[operation]
    const bodyItem = reqBody[(index + 1) * 2 - 1]
    if (item.status === 200) {
      responseBody.items.push({
        ...bodyItem.doc,
        id: item._id
      })
    } else {
      responseBody.hasError = true
      responseBody.errors.push({
        item: bodyItem,
        message: item.error.reason
      })
    }
  })

  return responseBody
}
