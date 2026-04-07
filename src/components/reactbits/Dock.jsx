import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'motion/react';
import { Children, cloneElement, useEffect, useRef, useState } from 'react';

function DockItem({ children, className = '', onClick, mouseX, spring, distance, magnification, baseItemSize }) {
  const ref = useRef(null);
  const isHovered = useMotionValue(0);

  const mouseDistance = useTransform(mouseX, (val) => {
    if (!Number.isFinite(val)) return distance;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return distance;
    const center = rect.left + rect.width / 2;
    return val - center;
  });

  const targetSize = useTransform(
    mouseDistance,
    [-distance, 0, distance],
    [baseItemSize, magnification, baseItemSize]
  );
  const size = useSpring(targetSize, spring);

  return (
    <motion.div
      ref={ref}
      style={{ width: size, height: size }}
      onHoverStart={() => isHovered.set(1)}
      onHoverEnd={() => isHovered.set(0)}
      onFocus={() => isHovered.set(1)}
      onBlur={() => isHovered.set(0)}
      onClick={onClick}
      className={`relative inline-flex shrink-0 items-center justify-center rounded-full bg-white/5 border border-white/10 shadow-md cursor-pointer ${className}`}
      tabIndex={0}
      role="button"
    >
      {Children.map(children, (child) =>
        child && typeof child.type !== 'string' ? cloneElement(child, { isHovered }) : child
      )}
    </motion.div>
  );
}

function DockLabel({ children, className = '', isHovered }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!isHovered?.on) return undefined;
    const unsubscribe = isHovered.on('change', (latest) => {
      setIsVisible(latest === 1);
    });
    return () => unsubscribe();
  }, [isHovered]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 8, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: 8, x: '-50%' }}
          transition={{ duration: 0.15 }}
          className={`pointer-events-none absolute -top-7 left-1/2 z-10 w-fit whitespace-nowrap rounded-md border border-white/10 bg-neutral-900 px-2 py-0.5 text-xs text-white ${className}`}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function DockIcon({ children, className = '', isHovered: _h }) {
  return <div className={`flex items-center justify-center ${className}`}>{children}</div>;
}

export default function Dock({
  items,
  className = '',
  spring = { mass: 0.1, stiffness: 180, damping: 14 },
  magnification = 56,
  distance = 120,
  baseItemSize = 44
}) {
  const mouseX = useMotionValue(Number.NaN);

  return (
    <div
      className={`${className} flex items-center justify-center gap-3 rounded-2xl border border-white/10 px-3 py-2`}
      onMouseMove={(e) => {
        mouseX.set(e.clientX);
      }}
      onMouseLeave={() => {
        mouseX.set(Number.NaN);
      }}
      role="toolbar"
      aria-label="Social links"
    >
      {items.map((item, index) => (
        <DockItem
          key={index}
          onClick={item.onClick}
          mouseX={mouseX}
          spring={spring}
          distance={distance}
          magnification={magnification}
          baseItemSize={baseItemSize}
        >
          <DockIcon>{item.icon}</DockIcon>
          <DockLabel>{item.label}</DockLabel>
        </DockItem>
      ))}
    </div>
  );
}
