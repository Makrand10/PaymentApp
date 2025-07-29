interface AlertProps {
  children: React.ReactNode;
  type: 'success' | 'error';
  className?: string;
}

export function Alert({ children, type, className = '' }: AlertProps) {
  const baseClasses = 'border px-4 py-3 rounded mb-4';
  const typeClasses = {
    success: 'bg-green-100 border-green-400 text-green-700',
    error: 'bg-red-100 border-red-400 text-red-700'
  };

  return (
    <div className={`${baseClasses} ${typeClasses[type]} ${className}`}>
      {children}
    </div>
  );
} 