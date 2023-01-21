import { expect, describe, beforeAll, afterAll, test } from '@jest/globals'
import clientManager from '../src/clientManager.mjs'
import Schema from '../src/Schema.mjs'
import Model from '../src/Model/index.mjs'

const modelName = 'Test'
const index = 'test-create'
const properties = {
  name: { type: 'keyword' },
  description: { type: 'text' },
  price: { type: 'integer' },
  isActive: { type: 'boolean' },
  meta: { type: 'object' }
}

const TestSchema = new Schema(index, properties)
const TestModel = new Model(modelName, TestSchema)

beforeAll(async () => {
  await clientManager.connect()
  await TestModel.createIndices()
})

afterAll(async () => {
  await TestModel.removeIndices()
})

describe('Test Opensearch Create', () => {
  test('CreateOne Success', async () => {
    const attrs = {
      name: 'Test',
      description: 'Test Description',
      price: 100,
      isActive: true,
      meta: {}
    }
    const document = await TestModel.createOne(attrs)

    expect(document).toHaveProperty('id')
    expect(document.name).toBe(attrs.name)
  })

  test('CreateMany Success', async () => {
    const attrs = [{ name: 'TEST1' }, { name: 'TEST2' }]
    const { items: documents } = await TestModel.createMany(attrs)

    expect(documents[0]).toHaveProperty('id')
    expect(documents[0].name).toBe(attrs[0].name)

    expect(documents[1]).toHaveProperty('id')
    expect(documents[1].name).toBe(attrs[1].name)
  })
})
