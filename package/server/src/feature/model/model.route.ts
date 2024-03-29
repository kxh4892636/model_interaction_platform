import { FastifyTypebox } from '@/type'
import { generateResponse } from '@/util/typebox'
import { randomUUID } from 'crypto'
import { eweService } from './model.ewe.service'
import {
  ModelActionBodySchema,
  ModelActionResponseSchema,
  ModelActionResponseType,
  ModelInfoQueryStringSchema,
  ModelInfoResponseSchema,
  ModelInfoResponseType,
  ModelParamResponseSchema,
  ModelParamResponseType,
  Water2DParamBodySchema,
} from './model.type'
import { modelService } from './model.water.service'

export const modelRoute = async (app: FastifyTypebox) => {
  app.route({
    method: 'get',
    url: '/info/:modelID',
    schema: {
      tags: ['model'],
      params: ModelInfoQueryStringSchema,
      response: {
        200: ModelInfoResponseSchema,
      },
    },
    handler: async (req): Promise<ModelInfoResponseType> => {
      const params = req.params
      const result = await modelService.getModelInfo(params.modelID)
      const response = generateResponse('success', '', result)
      return response
    },
  })

  app.route({
    method: 'post',
    url: '/param/water-2d',
    schema: {
      tags: ['model'],
      body: Water2DParamBodySchema,
      response: {
        200: ModelParamResponseSchema,
      },
    },
    handler: async (req): Promise<ModelParamResponseType> => {
      const body = req.body
      await modelService.setWater2DParam(body.projectID, body.hours)
      const response = generateResponse('success', '', null)
      return response
    },
  })

  app.route({
    method: 'post',
    url: '/water/action',
    schema: {
      tags: ['model'],
      body: ModelActionBodySchema,
      response: {
        200: ModelActionResponseSchema,
      },
    },
    handler: async (req): Promise<ModelActionResponseType> => {
      const body = req.body
      const modelID = body.modelID
      const action = body.action
      const init = body.modelInit
      if (action === 'run') {
        if (!init) throw Error()
        const modelID = randomUUID()
        if (init.modelType === 'water-2d') {
          modelService
            .runWater2DModel(init.modelName, init.projectID, modelID)
            .catch(() => {
              modelService.stopModel(modelID)
            })
        }
        const response = generateResponse('success', '', modelID)
        return response
      } else {
        if (!modelID) throw Error()
        modelService.stopModel(modelID)
        const response = generateResponse('success', '', null)
        return response
      }
    },
  })

  app.route({
    method: 'post',
    url: '/ewe/Import',
    schema: {},
    handler: async (req, res) => {
      try {
        res.status(200).send(await eweService.Import_Model(req, res))
      } catch (error) {
        if (error instanceof Error) {
          res.status(200).send({ status: 'fail', content: error.message })
        } else;
        console.log(error)
      }
    },
  })

  app.route({
    method: 'post',
    url: '/ewe/RunEcoPath',
    schema: {},
    handler: async (req, res) => {
      try {
        res.status(200).send(await eweService.RunEcoPath(req, res))
      } catch (error) {
        if (error instanceof Error) {
          res.status(200).send({ status: 'fail', content: error.message })
        } else;
        console.log(error)
      }
    },
  })

  app.route({
    method: 'post',
    url: '/ewe/RunEcoSim',
    schema: {},
    handler: async (req, res) => {
      try {
        res.status(200).send(await eweService.RunEcoSim(req, res))
      } catch (error) {
        if (error instanceof Error) {
          res.status(200).send({ status: 'fail', content: error.message })
        } else;
        console.log(error)
      }
    },
  })

  app.route({
    method: 'post',
    url: '/ewe/RunEcoSim_Switch',
    schema: {},
    handler: async (req, res) => {
      try {
        res.status(200).send(await eweService.RunEcoSim_Switch(req, res))
      } catch (error) {
        if (error instanceof Error) {
          res.status(200).send({ status: 'fail', content: error.message })
        } else;
        console.log(error)
      }
    },
  })

  app.route({
    method: 'post',
    url: '/ewe/GroupPlot_Switch',
    schema: {},
    handler: async (req, res) => {
      try {
        res.status(200).send(await eweService.GroupPlot_Switch(req, res))
      } catch (error) {
        if (error instanceof Error) {
          res.status(200).send({ status: 'fail', content: error.message })
        } else;
        console.log(error)
      }
    },
  })

  app.route({
    method: 'post',
    url: '/ewe/FleetPlot_Switch',
    schema: {},
    handler: async (req, res) => {
      try {
        res.status(200).send(await eweService.FleetPlot_Switch(req, res))
      } catch (error) {
        if (error instanceof Error) {
          res.status(200).send({ status: 'fail', content: error.message })
        } else;
        console.log(error)
      }
    },
  })

  app.route({
    method: 'post',
    url: '/ewe/RunEcoSpace',
    schema: {},
    handler: async (req, res) => {
      try {
        res.status(200).send(await eweService.RunEcoSpace(req, res))
      } catch (error) {
        if (error instanceof Error) {
          res.status(200).send({ status: 'fail', content: error.message })
        } else;
        console.log(error)
      }
    },
  })

  app.route({
    method: 'post',
    url: '/ewe/RunEcoSpace_Switch',
    schema: {},
    handler: async (req, res) => {
      try {
        res.status(200).send(await eweService.RunEcoSpace_Switch(req, res))
      } catch (error) {
        if (error instanceof Error) {
          res.status(200).send({ status: 'fail', content: error.message })
        } else;
        console.log(error)
      }
    },
  })

  app.route({
    method: 'post',
    url: '/ewe/RunEcoSpace_SwitchMap',
    schema: {},
    handler: async (req, res) => {
      try {
        res.status(200).send(await eweService.RunEcoSpace_SwitchMap(req, res))
      } catch (error) {
        if (error instanceof Error) {
          res.status(200).send({ status: 'fail', content: error.message })
        } else;
        console.log(error)
      }
    },
  })
}
