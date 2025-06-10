
import React from 'react';
import { Card } from '@/components/ui/card';

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export const AnimatedCard: React.FC<AnimatedCardProps> = ({ children, className = '', delay = 0 }) => {
  return (
    <Card 
      className={`
        backdrop-blur-sm border-0 shadow-xl 
        transform transition-all duration-500 
        hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-1
        animate-fade-in
        ${className}
      `}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </Card>
  );
};
