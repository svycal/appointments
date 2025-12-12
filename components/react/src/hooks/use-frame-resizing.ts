import { type RefObject, useEffect, useRef } from "react";

interface UseFrameResizing {
  containerRef: RefObject<HTMLDivElement | null>;
}

export function useFrameResizing(): UseFrameResizing {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const resizeEmbedFrame = () => {
    if (!containerRef.current) return;
    if (containerRef.current.scrollHeight === 0) return;

    const buffer = 4;
    const height = containerRef.current.scrollHeight + buffer;

    window.parent.postMessage({ event: "resized", height }, "*");
  };

  useEffect(() => {
    const currentRef = containerRef.current;
    if (!currentRef) return;

    const resizeObserver = new ResizeObserver(() => resizeEmbedFrame());
    resizeObserver.observe(currentRef);

    return () => {
      if (currentRef) {
        resizeObserver.unobserve(currentRef);
      }
    };
  }, []);

  return { containerRef };
}
