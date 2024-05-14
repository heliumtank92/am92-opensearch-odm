import _ from 'lodash'
import crypto from 'crypto'
import moment from 'moment'

import CONFIG, { SERVICE } from './CONFIG.mjs'

import OpensearchError from './OpensearchError.mjs'
import { INVALID_INDEX_ERROR } from './ERRORS.mjs'

const DEFAULT_SETTING = {
  index: {
    number_of_shards: 3,
    number_of_replicas: 2
  }
}

const DEFAULT_OPTIONS = {
  timestamp: true
}

const INDEX_INVALID_REGEX = /^[\\^\\+_-]|[\\/*?"<>|`` ,#:.]/g

export default class Schema {
  constructor(
    index = '',
    properties = {},
    settings = {},
    aliases = [],
    options = {}
  ) {
    const optionsProperties = _buildOptionsProperties(options)

    this.index = _sanitizeIndex(index)
    this.properties = _.merge({}, properties || { ...optionsProperties })
    this.settings = _.merge({}, DEFAULT_SETTING, settings || {})
    this.aliases = aliases || []
    this.options = _.merge({}, DEFAULT_OPTIONS, options || {})

    this.propsArray = Object.keys(this.properties)

    // Method Hard-binding
    this.instantiate = this.instantiate.bind(this)
  }

  instantiate(attrs = {}, type = 'create') {
    const { properties, propsArray, options } = this

    const props = _buildProps(propsArray, properties, attrs)
    const typeProps = _buildTypeProps(options, attrs, type)
    const instance = {
      ...props,
      ...typeProps
    }

    return instance
  }
}

function _buildProps(propsArray, properties, attrs) {
  const props = {}

  _.forEach(propsArray, prop => {
    const propExists = attrs[prop] !== undefined
    if (!propExists) {
      return
    }

    const config = properties[prop]
    const { type } = config
    let value = attrs[prop]

    if (type === 'integer' || type === 'long' || type === 'double') {
      value = _.isArray(value)
        ? _.map(value, _sanitizeValueNumber)
        : _sanitizeValueNumber(value)
    }

    if (type === 'boolean') {
      value = _.isArray(value)
        ? _.map(value, _sanitizeValueBoolean)
        : _sanitizeValueBoolean(value)
    }

    if (
      type === 'text' ||
      type === 'keyword' ||
      type === 'constant_keyword' ||
      type === 'wildcard'
    ) {
      value = _.isArray(value)
        ? _.map(value, _sanitizeValueString)
        : _sanitizeValueString(value)
    }

    if (type === 'object') {
      value = _.isObject(value) ? value : {}
    }

    props[prop] = value
  })

  return props
}

function _buildTypeProps(options, attrs, type) {
  const typeProps = {}

  switch (type) {
    case 'create': {
      typeProps.id = attrs.id || crypto.randomUUID()

      if (options.timestamp === true) {
        typeProps.createdAt = moment().toISOString()
        typeProps.updatedAt = typeProps.createdAt
      }

      break
    }

    case 'update': {
      if (options.timestamp === true) {
        typeProps.updatedAt = moment().toISOString()
      }

      break
    }
  }

  return typeProps
}

function _buildOptionsProperties(options) {
  const optionsProperties = {}

  if (options.timestamp === true) {
    optionsProperties.createdAt = {
      type: 'date',
      format: 'strict_date_optional_time'
    }
    optionsProperties.updatedAt = {
      type: 'date',
      format: 'strict_date_optional_time'
    }
  }

  return optionsProperties
}

function _sanitizeIndex(index) {
  let sanitizedIndex = (index || '').toLowerCase()
  sanitizedIndex = CONFIG.INDEX_PREFIX
    ? `${CONFIG.INDEX_PREFIX}-${sanitizedIndex.replace(
        INDEX_INVALID_REGEX,
        ''
      )}`
    : sanitizedIndex.replace(INDEX_INVALID_REGEX, '')

  if (!index || !sanitizedIndex) {
    throw new OpensearchError(
      { index: index || sanitizedIndex },
      INVALID_INDEX_ERROR
    )
  }

  if (index !== sanitizedIndex) {
    console.warn(
      `[${SERVICE} OpensearchOdm] Sanitizing Index from '${index}' to '${sanitizedIndex}'`
    )
  }

  return sanitizedIndex
}

function _sanitizeValueNumber(value) {
  let numVal = Number(value)
  return (isNaN(numVal) && 0) || numVal
}

function _sanitizeValueBoolean(value) {
  return (
    value === true ||
    _.chain(value).toString().lowerCase().trim().value() === 'true'
  )
}

function _sanitizeValueString(value) {
  return _.isString(value) ? value : value.toString()
}
