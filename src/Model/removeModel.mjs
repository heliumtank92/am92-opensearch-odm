import _ from 'lodash'
import clientManager from '../clientManager.mjs'

import OpensearchError from '../OpensearchError.mjs'
import { REMOVE_BY_ID_ERROR, REMOVE_ERROR } from '../ERRORS.mjs'

const removeModel = {
  remove,
  removeById
}

export default removeModel

async function remove (query = {}, options = {}) {
  try {
    const { Schema } = this
    const findProjection = { id: 1 }

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

    const response = _bulkRemove(Schema, instances)
    return response
  } catch (error) {
    throw new OpensearchError(error, REMOVE_ERROR)
  }
}

async function removeById (id, options = {}) {
  try {
    const { Schema } = this

    const { index } = Schema
    const params = {
      refresh: true,
      index,
      id
    }

    const client = clientManager.getPersistentClient()

    await client.delete(params)
  } catch (error) {
    throw new OpensearchError(error, REMOVE_BY_ID_ERROR)
  }
}

async function _bulkRemove (Schema, attrs = []) {
  const { index } = Schema
  const reqBody = _.reduce(
    attrs,
    (array, document) => {
      // Add Action
      array.push({
        delete: { _index: index, _id: document.id }
      })
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
    const bodyItem = reqBody[index]
    if (item.status === 200) {
      responseBody.items.push({
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
