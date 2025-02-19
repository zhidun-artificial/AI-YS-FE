import { PropsWithStyle } from "@/utils/types"
import { Select } from "antd"
import React, { useEffect, useState } from "react"

interface KnowledgeSelectProps {
  onUpdate?: (model: string) => void
}

const KnowledgeSelect: React.FC<PropsWithStyle<KnowledgeSelectProps>> = ({ style, onUpdate }) => {
  const [knowledgeList, setKnowledgeList] = useState<Array<{ name: string, value: string }>>([])
  const [selectKnowledge, setKnowledgeModel] = useState<string>("")

  useEffect(() => {
    const data = ([
      { name: "doc-1", value: "doc-1" },
      { name: "doc-2", value: "doc-2" },
      { name: "doc-3", value: "doc-3" },
    ])
    setKnowledgeList(data)
    setKnowledgeModel(data[0].value)
    if (onUpdate) onUpdate(data[0].value)
  }, [])

  const onSelectChange = (value: string) => {
    setKnowledgeModel(value)
    if (onUpdate) onUpdate(value)
  }

  return (
    <Select style={style} onChange={onSelectChange} value={selectKnowledge}>
      {
        knowledgeList.map((model, index) => {
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

export default KnowledgeSelect