import moment from 'moment'
import clientManager from '../clientManager.mjs'
import modelHelper from '../lib/modelHelper.mjs'

import OpensearchError from '../OpensearchError.mjs'
import {
  SEARCH_ERROR,
  FIND_ONE_ERROR,
  FIND_MANY_ERROR,
  FIND_BY_ID_ERROR,
  FIND_BY_IDS_ERROR,
  LIST_ERROR,
  FIND_BY_GEO_DISTANCE_ERROR,
  NO_TIMESTAMPS_ERROR,
  INVALID_DATE_FORMAT_ERROR,
  FIND_BY_DATE_RANGE_ERROR
} from '../ERRORS.mjs'

const filterModel = {
  findOne,
  findMany,
  findById,
  findByIds,
  findOneBy,
  findManyBy,
  list,
  findByGeoDistance,
  search,
  findByDateRange,
  findByDate
}

export default filterModel

async function findOne(query = {}, projection = {}, options = {}) {
  try {
    // Build Body
    const esBody = { query }

    // Build Options
    const searchOptions = {
      ...options,
      paramOptions: { ...options.paramOptions, size: 1 }
    }

    // Search and Return Return Result
    const response = await this.search(esBody, projection, searchOptions)
    const instance = modelHelper.extractSourceFromSearchResponse(
      response,
      'INSTANCE'
    )
    return instance
  } catch (error) {
    throw new OpensearchError(error, FIND_ONE_ERROR)
  }
}

async function findMany(query = {}, projection = {}, options = {}) {
  try {
    // Build Body
    const esBody = { query }

    // Search and Return Return Result
    const response = await this.search(esBody, projection, options)
    const instances = modelHelper.extractSourceFromSearchResponse(
      response,
      'INSTANCES'
    )
    return instances
  } catch (error) {
    throw new OpensearchError(error, FIND_MANY_ERROR)
  }
}

async function findById(id, projection = {}) {
  try {
    const { Schema } = this

    const { index } = Schema
    const projectionOptions = modelHelper.buildProjections(projection)
    const clientOptions = { ignore: [404] }
    const params = {
      index,
      id,
      ...projectionOptions
    }

    const client = clientManager.getPersistentClient()

    const response = await client.get(params, clientOptions)
    const { body, statusCode } = response

    if (statusCode === 404) {
      return null
    }

    const { _source: instance } = body
    return instance
  } catch (error) {
    throw new OpensearchError(error, FIND_BY_ID_ERROR)
  }
}

async function findByIds(ids = [], projection = {}, options = {}) {
  try {
    const query = { ids: { values: ids } }
    const instances = await this.findMany(query, projection, options)
    return instances
  } catch (error) {
    throw new OpensearchError(error, FIND_BY_IDS_ERROR)
  }
}

async function findOneBy(key = '', value, projection = {}, options = {}) {
  const query = { match: { [key]: value } }
  const instance = await this.findOne(query, projection, options)
  return instance
}

async function findManyBy(key = '', value, projection = {}, options = {}) {
  const query = { match: { [key]: value } }
  const instances = await this.findMany(query, projection, options)
  return instances
}

async function list(projection = {}, options = {}) {
  try {
    const query = { match_all: {} }
    const esBody = { query, size: 10000 }

    const response = await this.search(esBody, projection, options)
    const instances = modelHelper.extractSourceFromSearchResponse(
      response,
      'INSTANCES'
    )
    return instances
  } catch (error) {
    throw new OpensearchError(error, LIST_ERROR)
  }
}

async function findByGeoDistance(attrs = {}, projection = {}, options = {}) {
  try {
    const { key, value, distance, size = 10 } = attrs
    const esBody = {
      size,
      query: {
        bool: {
          must: {
            match_all: {}
          },
          filter: {
            geo_distance: {
              distance,
              [key]: value
            }
          }
        }
      },
      sort: [
        {
          _geo_distance: {
            [key]: value,
            order: 'asc',
            unit: 'm',
            mode: 'min',
            distance_type: 'arc',
            ignore_unmapped: true
          }
        }
      ]
    }

    const response = await this.search(esBody, projection, options)
    const documents = modelHelper.extractSourceFromSearchResponse(
      response,
      'DOCUMENTS'
    )
    const instances = documents.map(document => {
      const { _source, sort } = document
      const geoDistance = sort[0]
      const instance = { ..._source, geoDistance }
      return instance
    })
    return instances
  } catch (error) {
    throw new OpensearchError(error, FIND_BY_GEO_DISTANCE_ERROR)
  }
}

async function search(esBody = {}, projection = {}, options = {}) {
  try {
    const { Schema } = this
    const { index } = Schema

    const { clientOptions = {}, paramOptions = {}, bodyOptions = {} } = options
    const clientOpts = {
      ignore: [404],
      ...clientOptions
    }

    const projectionOptions = modelHelper.buildProjections(projection)
    const params = {
      ...paramOptions,
      index,
      ...projectionOptions,
      body: { ...esBody, ...bodyOptions }
    }

    const client = clientManager.getPersistentClient()

    const response = await client.search(params, clientOpts)
    return response
  } catch (error) {
    throw new OpensearchError(error, SEARCH_ERROR)
  }
}

async function findByDateRange(
  startDate,
  endDate,
  projection = {},
  options = {}
) {
  const { Schema = {} } = this
  const { options: schemaOptions = {} } = Schema

  if (!schemaOptions.timestamp) {
    throw new OpensearchError(
      { modelName: this.MODEL_NAME },
      NO_TIMESTAMPS_ERROR
    )
  }

  const isValidStartDate = modelHelper.validateDate(startDate)
  if (!isValidStartDate) {
    throw new OpensearchError({ startDate }, INVALID_DATE_FORMAT_ERROR)
  }

  const isValidEndDate = modelHelper.validateDate(endDate)
  if (!isValidEndDate) {
    throw new OpensearchError({ endDate }, INVALID_DATE_FORMAT_ERROR)
  }

  try {
    const startDateParsed = moment(startDate, 'YYYY-MM-DD')
      .startOf('day')
      .toISOString()
    const endDateParsed = moment(endDate, 'YYYY-MM-DD')
      .endOf('day')
      .toISOString()
    const esBody = {
      query: {
        range: {
          createdAt: {
            gte: startDateParsed,
            lte: endDateParsed,
            format: 'strict_date_optional_time'
          }
        }
      }
    }

    const response = await this.search(esBody, projection, options)
    const instances = modelHelper.extractSourceFromSearchResponse(
      response,
      'INSTANCES'
    )
    return instances
  } catch (error) {
    throw new OpensearchError(error, FIND_BY_DATE_RANGE_ERROR)
  }
}

async function findByDate(date, projection = {}, options = {}) {
  const isValidDate = modelHelper.validateDate(date)
  if (!isValidDate) {
    throw new OpensearchError({ date }, INVALID_DATE_FORMAT_ERROR)
  }

  const instances = await this.findByDateRange(date, date, projection, options)
  return instances
}
