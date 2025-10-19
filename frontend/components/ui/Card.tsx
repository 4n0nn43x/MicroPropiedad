interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
}

export default function Card({ children, className = '', hoverable = false }: CardProps) {
  return (
    <div
      className={`
        bg-white rounded-xl shadow-md overflow-hidden
        ${hoverable ? 'hover:shadow-lg transition-shadow' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
