import { getModels } from "@/services/models/getModels"
import { PropsWithStyle } from "@/utils/types"
import { Select } from "antd"
import React, { useEffect, useState } from "react"

interface ModelSelectProps {
  onUpdate?: (model: string) => void
}

const ModelSelect: React.FC<PropsWithStyle<ModelSelectProps>> = ({ style, onUpdate }) => {
  const [modelList, setModelList] = useState<Array<{ name: string, value: string }>>([])
  const [selectModel, setSelectModel] = useState<string>("")

  useEffect(() => {

    const updateModels = async () => {
      const res = await getModels();
      if (res instanceof Error) {
        console.error(res.message)
        return
      }
      const data = res.data.llm.map((model) => {
        return { name: model, value: model }
      })
      setModelList(data)
      setSelectModel(data[0].value)
      if (onUpdate) onUpdate(data[0].value)
    }

    updateModels()

  }, [])

  const onSelectChange = (value: string) => {
    setSelectModel(value)
    if (onUpdate) onUpdate(value)
  }

  return (
    <Select style={style} onChange={onSelectChange} value={selectModel}>
      {
        modelList.map((model, index) => {
          return (
            <Select.Option key={index} value={model.value}>
              {model.name}
            </Select.Option>
          )
        })
      }
    </Select>
  )
}

export default ModelSelect