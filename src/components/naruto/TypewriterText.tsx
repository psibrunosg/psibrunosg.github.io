import { useEffect, useRef, useState } from "react";

interface TypewriterTextProps {
  text: string;
  speed?: number;
  className?: string;
}

export default function TypewriterText({ text, speed = 30, className = "" }: TypewriterTextProps) {
  const [displayed, setDisplayed] = useState("");
  const indexRef = useRef(0);

  useEffect(() => {
    const typeNext = () => {
      const next = indexRef.current + 1;
      if (next > text.length) return;
      indexRef.current = next;
      setDisplayed(text.slice(0, next));
      setTimeout(typeNext, speed);
    };

    const timeoutId = setTimeout(typeNext, speed);
    return () => clearTimeout(timeoutId);
  }, [text, speed]);

  return (
    <p className={className}>
      {displayed}
      {displayed.length < text.length && (
        <span className="inline-block w-2 h-4 ml-1 bg-[#C65C2E] animate-pulse" aria-hidden="true" />
      )}
    </p>
  );
}
