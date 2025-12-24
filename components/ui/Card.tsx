
import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => {
  return (
    <motion.div
      whileHover={{ 
        scale: 1.02,
        boxShadow: "0 10px 30px -10px rgba(191, 193, 194, 0.1)"
      }}
      whileTap={{ scale: 0.98 }}
      className={`bg-surface rounded-lg p-4 cursor-pointer transition-colors duration-300 group ${className}`}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};
