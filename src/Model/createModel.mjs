import _ from 'lodash'
import clientManager from '../clientManager.mjs'
import OpensearchError from '../OpensearchError.mjs'
import {
  INDEX_DOES_NOT_EXIST_ERROR,
  CREATE_ONE_ERROR,
  CREATE_MANY_ERROR
} from '../ERRORS.mjs'

const createModel = {
  createOne,
  createMany
}

export default createModel

async function createOne(attrs = {}) {
  const { indicesExist } = await this.indicesExists()

  if (!indicesExist) {
    throw new OpensearchError(error, INDEX_DOES_NOT_EXIST_ERROR)
  }

  try {
    const { Schema } = this

    const { index } = Schema
    const instance = Schema.instantiate(attrs, 'create')
    const { id } = instance
    const params = {
      refresh: 'true',
      index,
      id,
      body: instance
    }

    const client = clientManager.getPersistentClient()

    await client.create(params)
    return instance
  } catch (error) {
    throw new OpensearchError(error, CREATE_ONE_ERROR)
  }
}

async function createMany(attrs = []) {
  const { indicesExist } = await this.indicesExists()

  if (!indicesExist) {
    throw new OpensearchError(error, INDEX_DOES_NOT_EXIST_ERROR)
  }

  try {
    const { Schema } = this

    const { index } = Schema
    const reqBody = _.reduce(
      attrs,
      (array, document) => {
        const instance = Schema.instantiate(document, 'create')
        // Add Action
        array.push({
          create: { _index: index, _id: instance.id }
        })
        // Add Doucument
        array.push(instance)
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
      if (item.status === 201) {
        responseBody.items.push({
          ...bodyItem,
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
  } catch (error) {
    throw new OpensearchError(error, CREATE_MANY_ERROR)
  }
}
