import { SERVICE } from './CONFIG.mjs'

const DEFAULT_ERROR_MSG = 'Opensearch Error'
const DEFAULT_ERROR_STATUS_CODE = 500
const DEFAULT_ERROR_CODE = 'OPENSEARCH_ERROR'

export default class OpensearchError extends Error {
  constructor (e = {}, eMap) {
    if (e._isCustomError && !eMap) { return e }

    super()

    const { message, statusCode, errorCode } = eMap || {}
    const {
      message: eMessage,
      msg: eMsg,
      code: eCode
    } = e

    this._isCustomError = true
    this._isOpensearchError = true
    this.service = SERVICE
    this.message = message || eMessage || eMsg || DEFAULT_ERROR_MSG
    this.statusCode = statusCode || DEFAULT_ERROR_STATUS_CODE
    this.errorCode = errorCode || eCode || DEFAULT_ERROR_CODE
    this.error = e
  }
}
