import { WaterModelTypeSchema } from '@/type'
import { Static, Type } from '@sinclair/typebox'
import { generateResponseSchema } from '../api.util'

// /model/info
export const ModelInfoSchema = Type.Object({
  modelID: Type.String(),
  modelDatasetID: Type.String(),
  modelProgress: Type.Number(),
  modelStatus: Type.String(),
})
export type ModelInfoType = Static<typeof ModelInfoSchema>
export const ModelInfoQueryStringSchema = Type.Object({
  modelID: Type.String(),
})
export type ModelInfoParamType = Static<typeof ModelInfoQueryStringSchema>
export const ModelInfoResponseSchema = generateResponseSchema(ModelInfoSchema)
export type ModelInfoResponseType = Static<typeof ModelInfoResponseSchema>

// /model/param/*
export const ModelParamSchema = Type.Null()
export type ModelParamType = Static<typeof ModelParamSchema>
export const ModelParamResponseSchema = generateResponseSchema(ModelParamSchema)
export type ModelParamResponseType = Static<typeof ModelParamResponseSchema>
// /model/param/water-2d
export const Water2DParamBodySchema = Type.Object({
  projectID: Type.String(),
  hours: Type.Integer(),
})
export type Water2DParamBodyType = Static<typeof Water2DParamBodySchema>

// /model/action
export const ModelActionSchema = Type.Union([Type.String(), Type.Null()])
export type ModelActionType = Static<typeof ModelActionSchema>
export const ModelActionBodySchema = Type.Object({
  modelID: Type.Union([Type.String(), Type.Null()]),
  action: Type.Union([Type.Literal('run'), Type.Literal('stop')]),
  modelInit: Type.Union([
    Type.Null(),
    Type.Object({
      projectID: Type.String(),
      modelType: WaterModelTypeSchema,
      modelName: Type.String(),
    }),
  ]),
})
export type ModelActionBodyType = Static<typeof ModelActionBodySchema>
export const ModelActionResponseSchema =
  generateResponseSchema(ModelActionSchema)
export type ModelActionResponseType = Static<typeof ModelActionResponseSchema>
