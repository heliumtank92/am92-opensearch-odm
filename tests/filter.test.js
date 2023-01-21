import { expect, describe, beforeAll, afterAll, test } from '@jest/globals'
import moment from 'moment'
import clientManager from '../src/clientManager.mjs'
import Schema from '../src/Schema.mjs'
import Model from '../src/Model/index.mjs'

const modelName = 'Test'
const index = 'test-filter'
const properties = { name: { type: 'keyword' } }

const TestSchema = new Schema(index, properties)
const TestModel = new Model(modelName, TestSchema)

let findById
const findOneObject = { name: 'FindOne Test' }
const findManyObject = { name: 'FindMany Test' }

beforeAll(async () => {
  await clientManager.connect()
  await TestModel.createIndices()
  const attrs = [
    { name: 'Find Test' },
    findOneObject,
    findManyObject,
    findManyObject
  ]
  const { items: documents } = await TestModel.createMany(attrs)
  findById = documents[0].id
})

afterAll(async () => {
  await TestModel.removeIndices()
})

describe('Test Opensearch Update', () => {
  test('FindById Success', async () => {
    const document = await TestModel.findById(findById)
    expect(document.id).toBe(findById)
  })

  test('FindOne Success', async () => {
    const findQuery = { match: findOneObject }
    const document = await TestModel.findOne(findQuery)
    expect(document.name).toBe(findOneObject.name)
  })

  test('FindOneBy Success', async () => {
    const document = await TestModel.findOneBy('name', findOneObject.name)
    expect(document.name).toBe(findOneObject.name)
  })

  test('FindMany Success', async () => {
    const findQuery = { match: findManyObject }
    const documents = await TestModel.findMany(findQuery)

    expect(documents.length).toBe(2)
    expect(documents[0].name).toBe(findManyObject.name)
    expect(documents[1].name).toBe(findManyObject.name)
  })

  test('FindManyBy Success', async () => {
    const documents = await TestModel.findManyBy('name', findManyObject.name)

    expect(documents.length).toBe(2)
    expect(documents[0].name).toBe(findManyObject.name)
    expect(documents[1].name).toBe(findManyObject.name)
  })

  test('List Success', async () => {
    const documents = await TestModel.list()
    expect(documents.length).toBe(4)
  })

  test('Search Success', async () => {
    const searchBody = { query: { match: findManyObject } }
    const response = await TestModel.search(searchBody)
    const { body, statusCode } = response
    const { hits: summary = {} } = body
    const { hits: documents } = summary

    expect(statusCode).toBe(200)
    expect(documents.length).toBe(2)
  })

  test('FindByDateRange Success', async () => {
    const date = moment().format('YYYY-MM-DD')
    const documents = await TestModel.findByDateRange(date, date)

    expect(documents.length).toBe(4)
  })

  test('FindByDate Success', async () => {
    const date = moment().format('YYYY-MM-DD')
    const documents = await TestModel.findByDate(date)

    expect(documents.length).toBe(4)
  })
})
