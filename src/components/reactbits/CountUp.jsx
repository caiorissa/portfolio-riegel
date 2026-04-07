import { useInView, useMotionValue, useSpring } from 'motion/react';
import { useCallback, useEffect, useRef } from 'react';

export default function CountUp({
  to,
  from = 0,
  direction = 'up',
  delay = 0,
  duration = 2,
  className = '',
  startWhen = true,
  separator = '',
  onStart,
  onEnd
}) {
  const rootRef = useRef(null);
  const textRef = useRef(null);
  const hasAnimatedInRef = useRef(false);

  const motionValue = useMotionValue(direction === 'down' ? to : from);

  const damping = 20 + 40 * (1 / duration);
  const stiffness = 100 * (1 / duration);

  const springValue = useSpring(motionValue, { damping, stiffness });

  const isInView = useInView(rootRef, { once: true, margin: '0px 0px -15% 0px' });

  const getDecimalPlaces = (num) => {
    const str = String(num);
    if (str.includes('.')) {
      const decimals = str.split('.')[1];
      if (parseInt(decimals, 10) !== 0) {
        return decimals.length;
      }
    }
    return 0;
  };

  const maxDecimals = Math.max(getDecimalPlaces(from), getDecimalPlaces(to));

  const formatValue = useCallback(
    (latest) => {
      const hasDecimals = maxDecimals > 0;
      const useGrouping = separator === ',' || separator === '.';
      const options = {
        useGrouping,
        minimumFractionDigits: hasDecimals ? maxDecimals : 0,
        maximumFractionDigits: hasDecimals ? maxDecimals : 0
      };
      const formattedNumber = Intl.NumberFormat('en-US', options).format(latest);
      if (separator === '.') {
        return formattedNumber.replace(/,/g, '.');
      }
      return formattedNumber;
    },
    [maxDecimals, separator]
  );

  useEffect(() => {
    if (textRef.current) {
      textRef.current.textContent = formatValue(direction === 'down' ? to : from);
    }
  }, [from, to, direction, formatValue]);

  useEffect(() => {
    if (!isInView || !startWhen) return undefined;

    const target = direction === 'down' ? from : to;

    if (hasAnimatedInRef.current) {
      motionValue.set(target);
      return undefined;
    }

    hasAnimatedInRef.current = true;
    if (typeof onStart === 'function') onStart();

    const timeoutId = window.setTimeout(() => {
      motionValue.set(target);
    }, delay * 1000);

    const durationTimeoutId = window.setTimeout(() => {
      if (typeof onEnd === 'function') onEnd();
    }, delay * 1000 + duration * 1000);

    return () => {
      window.clearTimeout(timeoutId);
      window.clearTimeout(durationTimeoutId);
    };
  }, [isInView, startWhen, motionValue, direction, from, to, delay, onStart, onEnd, duration]);

  useEffect(() => {
    const unsubscribe = springValue.on('change', (latest) => {
      if (textRef.current) {
        textRef.current.textContent = formatValue(latest);
      }
    });
    return () => unsubscribe();
  }, [springValue, formatValue]);

  return (
    <span ref={rootRef} className={`inline-block min-w-[1.5ch] tabular-nums ${className}`}>
      <span ref={textRef} />
    </span>
  );
}
