import { expect, describe, beforeAll, afterAll, test } from '@jest/globals'
import clientManager from '../src/clientManager.mjs'
import Schema from '../src/Schema.mjs'
import Model from '../src/Model/index.mjs'

const modelName = 'Test'
const index = 'test-remove'
const properties = { name: { type: 'text' } }

const TestSchema = new Schema(index, properties)
const TestModel = new Model(modelName, TestSchema)

let removeById
const bulkRemoveName = 'TEST2'
beforeAll(async () => {
  await clientManager.connect()
  await TestModel.createIndices()
  const attrs = [
    { name: 'TEST1' },
    { name: bulkRemoveName },
    { name: bulkRemoveName }
  ]
  const { items: documents } = await TestModel.createMany(attrs)
  removeById = documents[0].id
})

afterAll(async () => {
  await TestModel.removeIndices()
})

describe('Test Opensearch Remove', () => {
  test('RemoveById Success', async () => {
    const beforeDocument = await TestModel.findById(removeById)
    expect(beforeDocument.id).toBe(removeById)

    await TestModel.removeById(removeById)
    const document = await TestModel.findById(removeById)
    expect(document).toBeNull()
  })

  test('Bulk Remove Success', async () => {
    const query = { match: { name: bulkRemoveName } }
    const beforeDocuments = await TestModel.findMany(query)
    expect(beforeDocuments.length).toBe(2)

    await TestModel.remove(query)
    const documents = await TestModel.findMany(query)
    expect(documents.length).toBe(0)
  })
})
