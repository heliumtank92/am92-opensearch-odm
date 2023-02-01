import { expect, describe, beforeAll, afterAll, test } from '@jest/globals'
import clientManager from '../src/clientManager.mjs'
import Schema from '../src/Schema.mjs'
import Model from '../src/Model/index.mjs'

const modelName = 'Test'
const index = 'test-update'
const properties = { name: { type: 'keyword' } }

const TestSchema = new Schema(index, properties)
const TestModel = new Model(modelName, TestSchema)

beforeAll(async () => {
  await clientManager.connect()
  await TestModel.createIndices()
})

afterAll(async () => {
  await TestModel.removeIndices()
})

describe('Test Opensearch Update', () => {
  test('UpdateById Success', async () => {
    const attrs = { name: 'UpdateById Test' }
    const document = await TestModel.createOne(attrs)

    const updateAttrs = { name: 'UpdateById Test 2' }
    const updatedDocument = await TestModel.updateById(document.id, updateAttrs)

    expect(updatedDocument.name).toBe(updateAttrs.name)
  })

  test('UpdateOne Success', async () => {
    const attrs = { name: 'UpdateOne Test' }
    await TestModel.createOne(attrs)

    const updateQuery = { match: attrs }
    const updateAttrs = { name: 'UpdateOne Test 2' }
    const updatedDocument = await TestModel.updateOne(updateQuery, updateAttrs)

    expect(updatedDocument.name).toBe(updateAttrs.name)
  })

  test('UpdateOneBy Success', async () => {
    const attrs = { name: 'UpdateOneBy Test' }
    await TestModel.createOne(attrs)

    const updateAttrs = { name: 'UpdateOneBy Test 2' }
    const updatedDocument = await TestModel.updateOneBy('name', attrs.name, updateAttrs)

    expect(updatedDocument.name).toBe(updateAttrs.name)
  })

  test('UpdateMany Success', async () => {
    const singleAttrs = { name: 'UpdateMany Test' }
    const attrs = [singleAttrs, singleAttrs]
    await TestModel.createMany(attrs)

    const updateQuery = { match: singleAttrs }
    const updateAttrs = { name: 'UpdateMany Test 2' }
    const { items: updatedDocuments } = await TestModel.updateMany(updateQuery, updateAttrs)

    expect(updatedDocuments.length).toBe(2)
    expect(updatedDocuments[0].name).toBe(updateAttrs.name)
    expect(updatedDocuments[1].name).toBe(updateAttrs.name)
  })

  test('UpdateManyBy Success', async () => {
    const singleAttrs = { name: 'UpdateManyBy Test' }
    const attrs = [singleAttrs, singleAttrs]
    await TestModel.createMany(attrs)

    const updateAttrs = { name: 'UpdateManyBy Test 2' }
    const { items: updatedDocuments } = await TestModel.updateManyBy('name', singleAttrs.name, updateAttrs)

    expect(updatedDocuments.length).toBe(2)
    expect(updatedDocuments[0].name).toBe(updateAttrs.name)
    expect(updatedDocuments[1].name).toBe(updateAttrs.name)
  })
})
