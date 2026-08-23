import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only enable on desktop pointer devices
    if (window.matchMedia('(pointer: fine)').matches) {
      const updateMouse = (e) => {
        setMousePosition({ x: e.clientX, y: e.clientY });
        if (!isVisible) setIsVisible(true);
      };

      const handleHoverStart = (e) => {
        const target = e.target;
        if (target.closest('a, button, [role="button"], input, .cursor-pointer')) {
          setIsHovered(true);
        } else {
          setIsHovered(false);
        }
      };

      window.addEventListener('mousemove', updateMouse);
      window.addEventListener('mouseover', handleHoverStart);

      return () => {
        window.removeEventListener('mousemove', updateMouse);
        window.removeEventListener('mouseover', handleHoverStart);
      };
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full mix-blend-difference hidden md:block"
      animate={{
        x: mousePosition.x - (isHovered ? 20 : 7),
        y: mousePosition.y - (isHovered ? 20 : 7),
        width: isHovered ? 40 : 14,
        height: isHovered ? 40 : 14,
        backgroundColor: isHovered ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.85)',
        border: isHovered ? '1px solid rgba(255, 255, 255, 0.8)' : 'none'
      }}
      transition={{
        type: 'spring',
        stiffness: 500,
        damping: 35,
        mass: 0.5
      }}
    />
  );
}
