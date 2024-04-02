const {
  npm_package_name: pkgName = '',
  npm_package_version: pkgVersion = '',

  // Basic Details
  OPENSEARCH_PROTOCOL = '',
  OPENSEARCH_DOMAIN = '',

  // User Auth Details
  OPENSEARCH_AUTH_ENABLED = 'false',
  OPENSEARCH_USERNAME = '',
  OPENSEARCH_PASSWORD = '',

  // Index Details
  OPENSEARCH_INDEX_PREFIX = ''
} = process.env

const SERVICE = `${pkgName}@${pkgVersion}`
const fatalLogFunc = console.fatal || console.error

const AUTH_ENABLED = OPENSEARCH_AUTH_ENABLED === 'true'

const MISSING_CONFIG = []
const REQUIRED_CONFIG = ['OPENSEARCH_PROTOCOL', 'OPENSEARCH_DOMAIN']

if (AUTH_ENABLED) {
  REQUIRED_CONFIG.push('OPENSEARCH_USERNAME')
  REQUIRED_CONFIG.push('OPENSEARCH_PASSWORD')
}

REQUIRED_CONFIG.forEach(key => {
  if (!process.env[key]) {
    MISSING_CONFIG.push(key)
  }
})

if (MISSING_CONFIG.length) {
  fatalLogFunc(
    `[${SERVICE} OpensearchOdm] OpensearchOdm Config Missing: ${MISSING_CONFIG.join(
      ', '
    )}`
  )
  process.exit(1)
}

let OPENSEARCH_AUTH = ''
if (AUTH_ENABLED) {
  const username = encodeURIComponent(OPENSEARCH_USERNAME)
  const password = encodeURIComponent(OPENSEARCH_PASSWORD)
  OPENSEARCH_AUTH = `${username}:${password}@`
}

const node = `${OPENSEARCH_PROTOCOL}://${OPENSEARCH_AUTH}${OPENSEARCH_DOMAIN}`
const CONNECTION_CONFIG = {
  node,
  ssl: { rejectUnauthorized: false }
}

const CONFIG = {
  CONNECTION_CONFIG,
  INDEX_PREFIX: OPENSEARCH_INDEX_PREFIX
}

export default CONFIG

export { SERVICE }
