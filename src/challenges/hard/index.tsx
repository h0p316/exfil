import { useEffect, useRef, useState } from 'react';
import type { Challenge } from '../types';

const H2 = 'FLAG{sp3ctr0gr4m_s4b0t4g3}';
const H3 = 'FLAG{lsb_st3g0_cr1m3_sc3n3}';
const H4 = 'FLAG{h4sh_hunt3r_x0r_3d1t10n}';

// Hard #1: a "WASM" module (JS fallback edition — no backend, no wat2wasm either).
// check(s) returns the count of correct-position characters. Brute-force 4 chars.
const SECRET_CODE = 'w45m';
const check = (s: string) => s.split('').filter((c, i) => c === SECRET_CODE[i]).length;
(window as unknown as Record<string, unknown>).__wasm = { check };

function WasmIngMachine() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<number | null>(null);
  return (
    <div className="space-y-2">
      <p>
        A tiny "WASM" module exports <code>check(s)</code>. It returns how many characters are correct
        by position. The module is 4 characters of pure malice. The flag format, once you crack it:
        FLAG{'{'}w4sm_...{'}'} — you can figure out the rest.
      </p>
      <div className="flex gap-2">
        <input
          className="rounded border border-neutral-700 bg-black px-2 py-1 font-mono text-sm"
          maxLength={4}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="????"
        />
        <button
          className="rounded bg-neutral-700 px-3 py-1 font-mono text-sm"
          onClick={() => setResult(check(input))}
        >
          check(s)
        </button>
        {result !== null && <span className="font-mono text-sm text-orange-300">{result}/4 correct</span>}
      </div>
      {result === 4 && <p className="font-mono text-green-300">cracked. now assemble the flag.</p>}
    </div>
  );
}

// Hard #2: a WAV whose bytes contain the flag twice — once in a LIST INFO chunk
// and once as per-character mark frequencies (a real spectrogram would show text).
function makeSpectrogramWav(msg: string): Blob {
  const sr = 8000;
  const perChar = Math.floor(sr * 0.05);
  const n = perChar * msg.length;
  const data = new Int16Array(n);
  for (let i = 0; i < msg.length; i++) {
    const f = 400 + msg.charCodeAt(i) * 20;
    for (let j = 0; j < perChar; j++) data[i * perChar + j] = Math.sin((2 * Math.PI * f * j) / sr) * 12000;
  }
  const header = new TextEncoder().encode(`ICMT${msg} `);
  const buf = new ArrayBuffer(44 + header.length + n * 2);
  const v = new DataView(buf);
  const w = (o: number, s: string) => [...s].forEach((c, i) => v.setUint8(o + i, c.charCodeAt(0)));
  w(0, 'RIFF');
  v.setUint32(4, 36 + header.length + n * 2, true);
  w(8, 'WAVEfmt ');
  v.setUint32(16, 16, true);
  v.setUint16(20, 1, true);
  v.setUint16(22, 1, true);
  v.setUint32(24, sr, true);
  v.setUint32(28, sr * 2, true);
  v.setUint16(32, 2, true);
  v.setUint16(34, 16, true);
  w(36, 'data');
  v.setUint32(40, n * 2, true);
  new Uint8Array(buf, 44, header.length).set(header);
  new Int16Array(buf, 44 + header.length, n).set(data);
  return new Blob([buf], { type: 'audio/wav' });
}

function SpectrogramSabotage() {
  const [url, setUrl] = useState('');
  useEffect(() => {
    const u = URL.createObjectURL(makeSpectrogramWav(H2));
    setUrl(u);
    return () => URL.revokeObjectURL(u);
  }, []);
  return (
    <div className="space-y-2">
      <p>Our theme song. It slaps. It also spells. Real ones run <code>strings theme.wav</code>.</p>
      {url && <audio controls src={url} className="h-8" />}
      <canvas className="h-16 w-full rounded bg-black" title="a suspiciously convenient spectrogram canvas" />
    </div>
  );
}

// Hard #3: LSB steganography — the flag is written into pixel LSBs of this canvas.
function PixelPerfectCrime() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current!;
    const ctx = c.getContext('2d')!;
    c.width = 200;
    c.height = 80;
    const img = ctx.createImageData(200, 80);
    for (let i = 0; i < img.data.length; i += 4) {
      img.data[i] = 40 + Math.random() * 40;
      img.data[i + 1] = 0;
      img.data[i + 2] = 80 + Math.random() * 40;
      img.data[i + 3] = 255;
    }
    const bits = [...`${H3}\0`].flatMap((ch) => ch.charCodeAt(0).toString(2).padStart(8, '0').split('').map(Number));
    bits.forEach((bit, i) => {
      img.data[i * 4] = (img.data[i * 4] & 0xfe) | bit;
    });
    ctx.putImageData(img, 0, 0);
    ctx.font = '14px monospace';
    ctx.fillStyle = '#f0f';
    ctx.fillText('📎', 90, 45);
  }, []);
  return (
    <div className="space-y-2">
      <p>
        The mascot posed for a portrait. Every red channel LSB is a lie... or a bit. Decoder left in
        the DOM for your convenience: <code>getImageData → data[i*4] &amp; 1</code>.
      </p>
      <canvas ref={ref} className="rounded border border-purple-900" />
    </div>
  );
}

// Hard #4: flag XORed into a "font" blob; ships alongside decoys.
const XOR_KEY = 0x42;
const fontBlob = new Uint8Array([...H4].map((c) => c.charCodeAt(0) ^ XOR_KEY));
(window as unknown as Record<string, unknown>).__font = fontBlob;

function HashHunter() {
  return (
    <div className="space-y-2">
      <p>
        The bundle ships a proprietary "font" (it is not a font) plus 9,999 decoy flags. The real one
        is XORed into <code>window.__font</code>. Key hint: the answer to everything.
      </p>
      <code className="block break-all rounded bg-black p-2 text-xs text-neutral-500">
        Uint8Array([{[...fontBlob.slice(0, 16)].join(',')}, …]) // "font data", definitely
      </code>
    </div>
  );
}

function ServiceWorkerSupremacy() {
  return (
    <div className="space-y-2">
      <p>
        Our service worker guards <code className="text-cyan-300">/admin</code>. It issues JWTs. It
        also ships its own signing secret in its source, because it is a service worker, not a
        cryptographer. Forge <code>role=admin</code> and collect your flag.
      </p>
      <a href="/admin" className="font-mono text-cyan-300 underline">
        → /admin
      </a>
      <p className="text-xs text-neutral-500">(view-source: /sw.js — the secret is in there)</p>
    </div>
  );
}

export const hardChallenges: Challenge[] = [
  {
    id: 'hard1',
    mode: 'hard',
    name: 'WASMing Machine',
    blurb: 'A 4-char lock guarded by check(s). Brute force is a valid lifestyle.',
    hints: ['check(s) counts correct positions.', 'Iterate chars, keep what raises the score.', 'The code is w45m. Flag derives from it.'],
    Component: WasmIngMachine,
  },
  {
    id: 'hard2',
    mode: 'hard',
    name: 'Spectrogram Sabotage',
    blurb: 'The theme song is hiding text in plain sound.',
    hints: ['Download and run strings on it.', 'Each char is a different frequency.', 'LIST INFO chunks talk.'],
    Component: SpectrogramSabotage,
  },
  {
    id: 'hard3',
    mode: 'hard',
    name: 'Pixel Perfect Crime',
    blurb: 'Steganography, but make it frontend.',
    hints: ['Canvas pixels hold bits.', 'Red channel LSBs.', 'Read 8 bits per char until \\0.'],
    Component: PixelPerfectCrime,
  },
  {
    id: 'hard4',
    mode: 'hard',
    name: 'The Hash Hunter',
    blurb: 'One real flag, 9,999 liars, one XOR.',
    hints: ['window.__font is not a font.', 'XOR key is 0x42.', 'Decode the bytes to ASCII.'],
    Component: HashHunter,
  },
  {
    id: 'hard5',
    mode: 'hard',
    name: 'Service Worker Supremacy',
    blurb: 'The only "server" is a sassy service worker.',
    hints: ['Read /sw.js.', 'JWT secret is in the source.', 'Forge role=admin, pass ?token= to /admin.'],
    Component: ServiceWorkerSupremacy,
  },
];
