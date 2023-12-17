export const INVALID_INDEX_ERROR = {
  message: 'Cannot Create Schema with Given Index',
  errorCode: 'Opensearch::INVALID_INDEX'
}

export const CREATE_INDEX_ERROR = {
  errorCode: 'Opensearch::CREATE_INDEX'
}

export const REMOVE_INDEX_ERROR = {
  errorCode: 'Opensearch::REMOVE_INDEX'
}

export const INDEX_EXISTS_ERROR = {
  errorCode: 'Opensearch::INDEX_EXISTS'
}

export const INDEX_DOES_NOT_EXIST_ERROR = {
  message: 'Index does not exist',
  errorCode: 'Opensearch::INDEX_DOES_NOT_EXIST'
}

export const CREATE_ONE_ERROR = {
  errorCode: 'Opensearch::CREATE_ONE'
}

export const CREATE_MANY_ERROR = {
  errorCode: 'Opensearch::CREATE_MANY'
}

export const SEARCH_ERROR = {
  errorCode: 'Opensearch::SEARCH'
}

export const FIND_ONE_ERROR = {
  errorCode: 'Opensearch::FIND_ONE'
}

export const FIND_MANY_ERROR = {
  errorCode: 'Opensearch::FIND_MANY'
}

export const FIND_BY_ID_ERROR = {
  errorCode: 'Opensearch::FIND_BY_ID'
}

export const FIND_BY_IDS_ERROR = {
  errorCode: 'Opensearch::FIND_BY_IDS'
}

export const LIST_ERROR = {
  errorCode: 'Opensearch::LIST'
}

export const FIND_BY_GEO_DISTANCE_ERROR = {
  errorCode: 'Opensearch::FIND_BY_GEO_DISTANCE'
}

export const NO_TIMESTAMPS_ERROR = {
  message: 'Cannot filter by Date Range without Schema.options.timestamps',
  errorCode: 'Opensearch::NO_TIMESTAMPS'
}

export const INVALID_DATE_FORMAT_ERROR = {
  message: 'Invalid date format. The correct format is YYYY-MM-DD',
  errorCode: 'Opensearch::INVALID_DATE_FORMAT'
}

export const FIND_BY_DATE_RANGE_ERROR = {
  errorCode: 'Opensearch::FIND_BY_DATE_RANGE'
}

export const UPDATE_BY_ID_ERROR = {
  errorCode: 'Opensearch::UPDATE_BY_ID'
}

export const FIND_ONE_AND_UPDATE_ERROR = {
  errorCode: 'Opensearch::FIND_ONE_AND_UPDATE'
}

export const FIND_MANY_AND_UPDATE_ERROR = {
  errorCode: 'Opensearch::FIND_MANY_AND_UPDATE'
}

export const REMOVE_BY_ID_ERROR = {
  errorCode: 'Opensearch::REMOVE_BY_ID'
}

export const REMOVE_ERROR = {
  errorCode: 'Opensearch::REMOVE'
}
