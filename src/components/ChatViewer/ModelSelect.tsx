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
    const data = ([
      { name: "GPT-3", value: "gpt-3" },
      { name: "GPT-2", value: "gpt-2" },
      { name: "GPT-1", value: "gpt-1" },
    ])
    setModelList(data)
    setSelectModel(data[0].value)
    if (onUpdate) onUpdate(data[0].value)
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