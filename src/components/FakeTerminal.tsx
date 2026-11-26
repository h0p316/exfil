import { useEffect, useRef, useState } from 'react';

const BOOT = [
  'Initializing h4ck3r mode...',
  'Loading backend... [FAIL] (there is none)',
  'Contacting server... the server is a service worker and it is busy',
  'Warming up snark engine...',
  'Ready. Try not to embarrass yourself.',
];

export default function FakeTerminal() {
  const [lines, setLines] = useState<string[]>([]);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let i = 0;
    const t = setInterval(() => {
      setLines((l) => [...l, BOOT[i]]);
      i += 1;
      if (i >= BOOT.length) clearInterval(t);
    }, 350);
    return () => clearInterval(t);
  }, []);
  useEffect(() => {
    const el = ref.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);
  return (
    <div ref={ref} className="h-32 overflow-y-auto rounded border border-green-900 bg-black p-3 font-mono text-xs text-green-400">
      {lines.map((l, i) => (
        <div key={i}>
          <span className="text-green-700">$ </span>
          {l}
        </div>
      ))}
      <span className="animate-pulse">█</span>
    </div>
  );
}
