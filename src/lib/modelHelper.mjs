import _ from 'lodash'
import moment from 'moment'

const modelHelper = {
  buildIndicesParams,
  buildProjections,
  extractSourceFromSearchResponse,

  validateDate
}

export default modelHelper

function filterBlanks(collection) {
  const isArray = _.isArray(collection)
  const isObject = _.isObject(collection) && !isArray
  if (isObject) {
    return _.pickBy(collection, (value, key) => {
      return !_.isEmpty(value)
    })
  }

  if (isArray) {
    return _.filter(collection, !_.isEmpty)
  }
}

function buildIndicesParams(Schema, action = '') {
  const { index, properties, settings, aliases } = Schema

  switch (action) {
    case 'create': {
      const mappings = { properties }

      const body = {
        mappings,
        settings,
        aliases
      }

      const filteredBody = filterBlanks(body)

      const params = {
        index,
        body: filteredBody
      }

      return params
    }

    case 'open':
    case 'close':
    case 'delete': {
      const params = { index }
      return params
    }

    case 'updateSchema': {
      const { index, properties } = Schema
      const body = { properties }
      const filteredBody = filterBlanks(body)
      const params = { index, body: filteredBody }
      return params
    }

    case 'updateSettings': {
      const { index, settings } = Schema
      const filteredBody = filterBlanks(settings)
      const params = { index, body: filteredBody }
      return params
    }

    default: {
      return {}
    }
  }
}

function buildProjections(projection) {
  const projectionOptions = {}
  const searchIncludes = []
  const searchExcludes = []

  const projectionKeys = Object.keys(projection)
  if (projectionKeys.length) {
    _.forEach(projectionKeys, prop => {
      const value = projection[prop]
      const array = (value && searchIncludes) || searchExcludes
      array.push(prop)
    })

    if (!_.isEmpty(searchIncludes)) {
      projectionOptions._source_includes = searchIncludes
    }
    if (!_.isEmpty(searchExcludes)) {
      projectionOptions._source_excludes = searchExcludes
    }
  }

  return projectionOptions
}

function extractSourceFromSearchResponse(response, returnType) {
  const { body, statusCode } = response
  const { hits: summary = {} } = body
  const { hits: documents = [] } = summary
  let result

  switch (returnType) {
    case 'SUMMARY': {
      result = (statusCode === 404 && []) || summary
      break
    }

    case 'DOCUMENTS': {
      result = (statusCode === 404 && []) || documents
      break
    }

    case 'INSTANCES': {
      result =
        (statusCode === 404 && []) ||
        _.map(documents, document => {
          const { _source: instance } = document
          return instance
        })
      break
    }

    case 'INSTANCE': {
      result =
        (statusCode === 404 && null) || (documents[0] || {})._source || null
      break
    }

    default: {
      result =
        (statusCode === 404 && null) || (documents[0] || {})._source || null
      break
    }
  }

  return result
}

function validateDate(date = '') {
  const dateObject = moment(date, 'YYYY-MM-DD', true)
  return dateObject._isValid
}
