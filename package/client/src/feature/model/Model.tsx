import { getModelInfoAPI, postModelActionAPI } from '@/api/model/model.api'
import { useLayersStore } from '@/store/layerStore'
import { useMetaStore } from '@/store/metaStore'
import { useModalStore } from '@/store/modalStore'
import { WaterModelTypeType } from '@/type'
import { Button, message } from 'antd'
import { AreaSelect } from './AreaSelect'
import { DataUpload } from './DataUpload'
import { ModelParamEditor } from './ModelParameterEditor'
import { useModeStore } from './model.store'

const runModelAction = async (
  projectID: string,
  modelType: WaterModelTypeType,
  forceUpdateLayerTree: () => void,
) => {
  const result = await postModelActionAPI({
    modelID: null,
    action: 'run',
    modelInit: {
      modelName:
        modelType +
        `-输出数据-${new Date(Date.now()).toLocaleTimeString().toString()}`,
      modelType,
      projectID,
    },
  })
  if (result.data === null) return false
  const modelID = result.data
  let errorTimes = 0
  const intervalID = setInterval(async () => {
    const result = await getModelInfoAPI(modelID)
    if (result.status === 'error') {
      if (errorTimes > 3) {
        message.error('模型运行失败')
        clearInterval(intervalID)
        forceUpdateLayerTree()
      } else {
        errorTimes++
      }
      return
    }

    if (result.status === 'success') {
      if (result.data === null) {
        message.error('模型运行失败')
        clearInterval(intervalID)
        forceUpdateLayerTree()
        return
      }
      if (result.data.modelStatus === 'valid') {
        message.info('模型运行完成')
        clearInterval(intervalID)
        forceUpdateLayerTree()
      }
    }
  }, 5000)
}

export const Model = () => {
  const projectID = useMetaStore((state) => state.projectID)
  const modelType = useMetaStore((state) => state.modelType)
  const modelArea = useModeStore((state) => state.modelArea)
  const openModal = useModalStore((state) => state.openModal)
  const forceUpdateLayerTree = useLayersStore(
    (state) => state.forceUpdateLayerTree,
  )
  const toolList = (() => {
    const arr: {
      label: string
      action: () => void
    }[] = []
    if (modelArea === 'undefined') {
      arr.push({
        label: '确定研究区域',
        action: () => {
          openModal(<AreaSelect></AreaSelect>)
        },
      })
    } else {
      arr.push({
        label: '选择其他区域',
        action: () => {
          openModal(<AreaSelect></AreaSelect>)
        },
      })
      arr.push({
        label: '上传模型文件',
        action: () => {
          openModal(<DataUpload></DataUpload>)
        },
      })
      arr.push({
        label: '设置模型参数',
        action: () => {
          openModal(<ModelParamEditor></ModelParamEditor>)
        },
      })
      arr.push({
        label: '计算模型',
        action: async () => {
          if (!projectID) return
          runModelAction(projectID, modelType, forceUpdateLayerTree)
        },
      })
    }

    const result = arr.map((value) => {
      return (
        <div key={value.label} className="flex justify-center">
          <Button
            size="small"
            type="primary"
            onClick={value.action}
            className="w-32"
          >
            {value.label}
          </Button>
        </div>
      )
    })

    return result
  })()
  return (
    <div
      className="grid grid-cols-2 gap-y-1 border border-slate-300 bg-white py-1"
    >
      {toolList}
    </div>
  )
}
