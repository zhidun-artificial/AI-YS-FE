import { searchKnowledgeBase } from "@/services/knowledge-base/searchKnowledge"
import { PropsWithStyle } from "@/utils/types"
import { Select } from "antd"
import React, { useEffect, useState } from "react"

interface KnowledgeSelectProps {
  onUpdate?: (base: string[]) => void
}

const KnowledgeSelect: React.FC<PropsWithStyle<KnowledgeSelectProps>> = ({ style, onUpdate }) => {
  const [knowledgeList, setKnowledgeList] = useState<Array<{ name: string, value: string }>>([])
  const [selectBases, setSelectBases] = useState<string[]>([])

  useEffect(() => {

    const updateKnowledge = async () => {
      const res = await searchKnowledgeBase();
      if (res instanceof Error) {
        return;
      }
      if (res.code === 0) {
        setKnowledgeList(res.data.records.map((item) => {
          return { name: item.name, value: item.id }
        }))
      }
    }
    updateKnowledge()
  }, [])

  const onSelectChange = (value: string[]) => {
    setSelectBases(value)
    if (onUpdate) onUpdate(value)
  }

  return (
    <Select style={style} mode="multiple" onChange={onSelectChange} value={selectBases}>
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