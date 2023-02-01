import _ from 'lodash'

const utils = {
  flattenObj,
  flattenArray,
  unflattenObj,
  mergeObjs,

  sanitizeString,
  sanitizeObj,
  sanitizeValue,
  chunkString
}

export default utils

function flattenObj (obj, options = {}) {
  const { sanitize = false, baseKey = '' } = options
  let flatObj = {}

  Object.keys(obj).forEach(key => {
    const value = obj[key]
    const flatObjKey = (baseKey && `${baseKey}.${key}`) || key

    if (value instanceof Array) {
      flatObj[flatObjKey] = value
      return
    }

    if (value && value.toString() === '[object Object]') {
      options.baseKey = flatObjKey
      const nestedFlatObj = flattenObj(value, options)
      flatObj = { ...flatObj, ...nestedFlatObj }
      return
    }

    const sanitizedValue = (sanitize && sanitizeValue(value)) || value
    if (sanitize && !sanitizedValue) { return }
    flatObj[flatObjKey] = sanitizedValue
  })

  return flatObj
}

function flattenArray (array = [], options = {}) {
  const { sanitize = false, shouldFlattenArray = true, baseKey = '' } = options
  let flatObj = {}

  if (!shouldFlattenArray) {
    return { [baseKey]: array }
  }

  _.forEach(array, (value, index) => {
    const flatObjKey = `${baseKey}[${index}]`
    options.baseKey = flatObjKey

    if (value instanceof Array) {
      const flatArrayObj = flattenArray(value, options)
      flatObj = { ...flatObj, ...flatArrayObj }
      return
    }

    if (value && value.toString() === '[object Object]') {
      const nestedFlatObj = flattenObj(value, options)
      flatObj = { ...flatObj, ...nestedFlatObj }
      return
    }

    const sanitizedValue = (sanitize && sanitizeValue(value)) || value
    if (sanitize && !sanitizedValue) { return }
    flatObj[flatObjKey] = sanitizedValue
  })

  return flatObj
}

function unflattenObj (flatObj) {
  const obj = {}
  _.forEach(flatObj, (value, key) => {
    _.set(obj, key, value)
  })

  return obj
}

function mergeObjs () {
  const objects = [...arguments]

  const objectsFlat = _.map(objects, (obj) => flattenObj(obj))
  const mergedObjFlat = _.reduce(objectsFlat, (acc, obj) => ({ ...acc, ...obj }), {})
  const mergedObj = unflattenObj(mergedObjFlat)

  return mergedObj
}

function sanitizeString (str = '') {
  return str.trim().replace(/([,. ][,. ])\1+/g, '$1').replace(/^[,. ]/, '').replace(/[,. ]+$/, '').trim()
}

function sanitizeObj (obj) {
  const objFlat = flattenObj(obj)
  const returnObjFlat = {}

  _.forIn(objFlat, (value, key) => {
    const sanitizedValue = sanitizeValue(value)
    if (!sanitizedValue) { return }
    returnObjFlat[key] = sanitizedValue
  })

  const returnObj = unflattenObj(returnObjFlat)
  return returnObj
}

function sanitizeValue (value) {
  const typeofValue = typeof value

  switch (typeofValue) {
    case 'string': return sanitizeString(value)
    case 'number': return value
    case 'boolean': return value
  }
}

function chunkString (str, length) {
  const chunks = str.match(new RegExp(`.{1,${length}}`, 'g')) || []
  const chunksSanitized = chunks.map(chunk => sanitizeString(chunk))
  return chunksSanitized
}
