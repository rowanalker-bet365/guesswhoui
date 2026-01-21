import React from 'react';
import { icons } from 'lucide-react';

interface IconProps {
  name: keyof typeof icons;
  color?: string;
  size?: number;
  className?: string;
}

const Icon: React.FC<IconProps> = ({ name, color, size, className }) => {
  const LucideIcon = icons[name];

  if (!LucideIcon) {
    return null;
  }

  return <LucideIcon color={color} size={size} className={className} />;
};

export { Icon };