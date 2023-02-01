import { expect, describe, beforeAll, test } from '@jest/globals'
import clientManager from '../src/clientManager.mjs'
import Schema from '../src/Schema.mjs'
import Model from '../src/Model/index.mjs'

const modelName = 'Test'
const index = 'test-indices'
const properties = { name: { type: 'text' } }

const TestSchema = new Schema(index, properties)
const TestModel = new Model(modelName, TestSchema)

beforeAll(async () => {
  await clientManager.connect()
})

describe('Test Opensearch Indices', () => {
  test('Create Index Success', async () => {
    await TestModel.createIndices()
    const { indicesExist } = await TestModel.indicesExists()
    expect(indicesExist).toBe(true)
  })

  test('Delete Index Success', async () => {
    await TestModel.removeIndices()
    const { indicesExist } = await TestModel.indicesExists()
    expect(indicesExist).toBe(false)
  })
})
