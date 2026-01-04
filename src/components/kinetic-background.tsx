'use client';

import { useState, useEffect, useMemo } from 'react';

const symbols = ['+', '−', '×', '÷', '√', '∫', '∑', '∞', 'π', 'Δ', 'ƒ(x)', 'α', 'β', 'γ'];

const KineticBackground = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  const floatingSymbols = useMemo(() => {
    // Only generate symbols on the client
    if (!isClient) return [];
    return Array.from({ length: 20 }).map((_, i) => {
      const size = Math.random() * 2 + 1; // 1rem to 3rem
      const initialX = Math.random() * 100;
      const initialY = Math.random() * 100;
      const moveFactor = Math.random() * 0.02 + 0.005; // How much it moves
      const symbol = symbols[Math.floor(Math.random() * symbols.length)];
      const opacity = Math.random() * 0.2 + 0.05;

      return {
        id: i,
        style: {
          fontSize: `${size}rem`,
          left: `${initialX}vw`,
          top: `${initialY}vh`,
          opacity: opacity,
        },
        moveFactor,
        symbol,
      };
    });
  }, [isClient]);

  if (!isClient) {
    return null;
  }

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
      {floatingSymbols.map(({ id, style, moveFactor, symbol }) => {
        const x = (mousePosition.x - window.innerWidth / 2) * moveFactor;
        const y = (mousePosition.y - window.innerHeight / 2) * moveFactor;
        
        return (
          <span
            key={id}
            className="absolute font-headline text-slate-700 transition-transform duration-500 ease-out"
            style={{
              ...style,
              transform: `translate(${x}px, ${y}px)`,
            }}
          >
            {symbol}
          </span>
        );
      })}
    </div>
  );
};

export default KineticBackground;
