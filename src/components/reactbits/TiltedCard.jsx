import { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

const springValues = {
  damping: 30,
  stiffness: 100,
  mass: 2
};

export default function TiltedCard({
  children,
  containerHeight = '300px',
  containerWidth = '100%',
  scaleOnHover = 1.05,
  rotateAmplitude = 14,
  showMobileWarning = false,
  className = '',
  onClick
}) {
  const ref = useRef(null);
  const rotateX = useSpring(useMotionValue(0), springValues);
  const rotateY = useSpring(useMotionValue(0), springValues);
  const scale = useSpring(1, springValues);

  function handleMouse(e) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - rect.width / 2;
    const offsetY = e.clientY - rect.top - rect.height / 2;
    rotateX.set((offsetY / (rect.height / 2)) * -rotateAmplitude);
    rotateY.set((offsetX / (rect.width / 2)) * rotateAmplitude);
  }

  function handleMouseEnter() {
    scale.set(scaleOnHover);
  }

  function handleMouseLeave() {
    scale.set(1);
    rotateX.set(0);
    rotateY.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        width: containerWidth,
        height: containerHeight,
        rotateX,
        rotateY,
        scale,
        transformPerspective: 800
      }}
      className={`relative [transform-style:preserve-3d] ${className}`}
    >
      {showMobileWarning && (
        <p className="text-center text-sm text-neutral-500 block sm:hidden">
          This effect is not optimized for mobile. Check on desktop.
        </p>
      )}
      {children}
    </motion.div>
  );
}
