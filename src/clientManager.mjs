import { Client } from '@opensearch-project/opensearch'
import CONFIG, { SERVICE } from './CONFIG.mjs'

const { CONNECTION_CONFIG } = CONFIG
let persistentClient

const clientManager = {
  connect,
  createClient,
  releaseClient,
  getPersistentClient
}

export default clientManager

const successLogFunc = console.success || console.info

async function connect () {
  console.info(`[${SERVICE} OpensearchOdm] Establishing Opensearch Connection...`)
  persistentClient = await createClient(CONNECTION_CONFIG)
  successLogFunc(`[${SERVICE} OpensearchOdm] Opensearch Connection Established`)
}

async function createClient (connectionConfig = CONNECTION_CONFIG) {
  const client = new Client(connectionConfig)
  return client
}

function releaseClient (client) {
  client.close()
  console.info(`[${SERVICE} OpensearchOdm] Opensearch Connection Closed`)
}

function getPersistentClient () {
  return persistentClient
}
