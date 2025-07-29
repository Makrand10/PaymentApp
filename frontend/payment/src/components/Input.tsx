interface InputProps {
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  className?: string;
  min?: string;
  max?: string;
  step?: string;
}

export function Input({ 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  required = false,
  className = '',
  min,
  max,
  step
}: InputProps) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      min={min}
      max={max}
      step={step}
      className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${className}`}
    />
  );
} 