import React, { useEffect, useState, useRef } from 'react';

const LazyLoad = ({ children, threshold = 0.1, onIntersect }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (onIntersect) onIntersect();
          observer.disconnect();
        }
      },
      { threshold }
    );

    if (ref.current) observer.observe(ref.current);

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, [onIntersect, threshold]);

  return <div ref={ref}>{isVisible ? children : null}</div>;
};

export default LazyLoad;
