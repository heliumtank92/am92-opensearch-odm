import indicesModel from './indicesModel.mjs'
import createModel from './createModel.mjs'
import filterModel from './filterModel.mjs'
import updateModel from './updateModel.mjs'
import removeModel from './removeModel.mjs'

export default class Model {
  constructor(MODEL_NAME, Schema) {
    this.MODEL_NAME = MODEL_NAME
    this.Schema = Schema

    // Method Hard Binding
    this.createIndices = indicesModel.createIndices.bind(this)
    this.removeIndices = indicesModel.removeIndices.bind(this)
    this.indicesExists = indicesModel.indicesExists.bind(this)

    this.createOne = createModel.createOne.bind(this)
    this.createMany = createModel.createMany.bind(this)

    this.findOne = filterModel.findOne.bind(this)
    this.findMany = filterModel.findMany.bind(this)
    this.findById = filterModel.findById.bind(this)
    this.findByIds = filterModel.findByIds.bind(this)
    this.findOneBy = filterModel.findOneBy.bind(this)
    this.findManyBy = filterModel.findManyBy.bind(this)

    this.findOneAndUpdate = updateModel.findOneAndUpdate.bind(this)
    this.findManyAndUpdate = updateModel.findManyAndUpdate.bind(this)
    this.updateOne = updateModel.updateOne.bind(this)
    this.updateMany = updateModel.updateMany.bind(this)
    this.updateById = updateModel.updateById.bind(this)
    this.updateOneBy = updateModel.updateOneBy.bind(this)
    this.updateManyBy = updateModel.updateManyBy.bind(this)

    this.remove = removeModel.remove.bind(this)
    this.removeById = removeModel.removeById.bind(this)

    this.list = filterModel.list.bind(this)
    this.search = filterModel.search.bind(this)
    this.findByGeoDistance = filterModel.findByGeoDistance.bind(this)
    this.findByDateRange = filterModel.findByDateRange.bind(this)
    this.findByDate = filterModel.findByDate.bind(this)
  }
}
