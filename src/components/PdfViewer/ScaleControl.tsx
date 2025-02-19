import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';

interface ScaleControlProps {
  onScaleChange: (scale: number) => void;
  value?: number;
}

const ScaleControl: React.FC<ScaleControlProps> = ({
  onScaleChange,
  value,
}) => {
  const [scale, setScale] = useState(1.0);

  const handleScaleChange = (addScale: number) => {
    const newScale = scale + addScale;
    if (newScale <= 0) return;
    setScale(newScale);
    onScaleChange(newScale);
  };

  useEffect(() => {
    if (value) {
      setScale(value);
    }
  }, [value]);

  return (
    <div className="flex items-center gap-1">
      <span>缩放</span>
      <MinusCircleOutlined onClick={() => handleScaleChange(-0.1)} />
      <span className="select-none">{`${(scale * 100).toFixed(0)}%`}</span>
      <PlusCircleOutlined onClick={() => handleScaleChange(0.1)} />
    </div>
  );
};

export default ScaleControl;
