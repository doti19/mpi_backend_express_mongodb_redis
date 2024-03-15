const APIError = require('../utils/APIError')
const catchAsync = require('./../utils/catchAsync')
const APIFeatures = require('./../utils/apiFeatures')
const { promisify } = require('util')
const moment = require('moment')


exports.deleteOne = (Model) =>
   catchAsync(async (req, res, next) => {
      const doc = await Model.findByIdAndDelete(req.params.id)

      if (!doc) {
         return next(new APIError({message: 'No document found with that ID', status:404}))
      }

      res.status(204).json({
         status: 'success',
         data: 'Null',
      })
   })

exports.updateOne = (Model) =>
   catchAsync(async (req, res, next) => {
      const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
         new: true,
         runValidators: true,
      })

      if (!doc) {
         return next(new APIError({message: 'No document found with that ID', status:404}))
      }

      res.status(200).json({
         status: 'success',
         doc,
         // data: {
         //    data: doc,
         // },
      })
   })

exports.createOne = (Model) =>
   catchAsync(async (req, res, next) => {
      req.body.createdTime = moment(Date.now()).format(
         'dddd, MMMM D, YYYY h:mm:ss A'
      )
      const doc = await Model.create(req.body)
      res.status(201).json({
         status: 'success',
         data: doc,
      })
   })

exports.getOne = (Model, popOptions) =>
   catchAsync(async (req, res, next) => {
      let query = Model.findById(req.params.id)
      if (popOptions) query = query.populate(popOptions)
      const doc = await query

      if (!doc) {
         return next(new APIError({message: 'No document found with that ID', status:404}))
      }

      res.status(200).json({
         status: 'success!',
         data: doc,
      })
   })
exports.getConversation = (Model, popOptions) =>
   catchAsync(async (req, res, next) => {
      // console.log('sender', req.user.id, 'receiver', req.params.id)

      let query = Model.find({
         $or: [
            { sender: req.user.id, receiver: req.params.id },
            { receiver: req.user.id, sender: req.params.id },
         ],
         // conversationId: req.params.id,
      })

      if (popOptions) query = query.populate(popOptions)
      const doc = await query

      if (doc.length == 0)
         return next(new APIError({message: 'No chat found with that ID', status:404}))

      if (!doc) {
         return next(new APIError({message: 'No document found with that ID', status:404}))
      }

      res.status(200).json({
         status: 'success!',
         // receiver: ""
         receiver: doc[0].receiver,
         results: doc.length,
         data: doc,
      })
   })

exports.getAll = (Model) =>
   catchAsync(async (req, res, next) => {
      //  To allow for nested GET comments on news (hack)
      let filter = {}
      if (req.params.newsId) filter = { news: req.params.newsId }

      // const currentUser = res.user
      const features = new APIFeatures(Model.find(filter), req.query)
         .filter()
         .sort()
         .limitFields()
         .paginate()
      const doc = await features.query

      res.status(200).json({
         status: 'success!',
         results: doc.length,
         data: doc,
      })
   })
