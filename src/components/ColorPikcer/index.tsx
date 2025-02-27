const ColorPicker = ({
  value,
  onChange,
  colorOptions,
}: {
  value: string;
  onChange: (value: string) => void;
  colorOptions: string[];
}) => {
  return (
    <div className="flex flex-row gap-2">
      {colorOptions.map((option) => (
        <div
          key={option}
          onClick={() => onChange(option)}
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            backgroundColor: option,
            border: value === option ? '2px solid blue' : 'none',
            cursor: 'pointer',
          }}
        />
      ))}
    </div>
  );
};

export default ColorPicker;
