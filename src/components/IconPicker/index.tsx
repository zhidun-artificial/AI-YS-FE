import { Icon } from 'umi';

const IconPicker = ({
  value,
  onChange,
  iconOptions,
}: {
  value: string;
  onChange: (value: string) => void;
  iconOptions: string[];
}) => {
  return (
    <div className="flex flex-row gap-2">
      {iconOptions.map((option) => (
        <div
          key={option}
          onClick={() => onChange(option)}
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f0f0f0',
            border: value === option ? '2px solid blue' : 'none',
            cursor: 'pointer',
          }}
        >
          <Icon
            icon={option as any}
            style={{ fill: value === option ? 'blue' : 'black' }}
          />
        </div>
      ))}
    </div>
  );
};

export default IconPicker;
