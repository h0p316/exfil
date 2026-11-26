import { useEffect } from 'react';
import { create } from 'zustand';
import type { Challenge } from '../types';

const M1 = 'FLAG{k3yfr4m3s_4r3_just_b00ks}';
const M2 = 'FLAG{l0c4l_st0r4g3_labyr1nth}';
const M3 = 'FLAG{b4s364_l4s4gn4_3xtr4_ch33s3}';
const M4 = 'FLAG{zust4nd_0f_m1nd}';
const M5 = 'FLAG{f0und_1n_th3_m1n1f13d_h4y5t4ck}';

function KeyframeKaraoke() {
  useEffect(() => {
    const chars = M1.split('');
    const frames = chars
      .map((c, i) => `  ${i}% { content: '${c}'; /* frame ${i}: letter '${c}' */ }`)
      .join('\n');
    const style = document.createElement('style');
    style.id = 'karaoke-frames';
    style.textContent = `@keyframes karaoke_flag_flipbook {\n${frames}\n}\n.karaoke { animation: karaoke_flag_flipbook 1s steps(1) infinite; }`;
    document.head.appendChild(style);
    return () => style.remove();
  }, []);
  return <p>200 lines of CSS, one flipbook. Read the <code>@keyframes</code> like a storybook.</p>;
}

function LocalStorageLabyrinth() {
  useEffect(() => {
    const parts = M2.match(/.{1,7}/g)!;
    const order = [3, 0, 4, 1, 2];
    for (let i = 0; i < 60; i++) localStorage.setItem(`decoy_${i}`, `FLAG{n0p3_${i}}`);
    order.forEach((slot, i) => localStorage.setItem(`fragment_${slot}`, parts[i]));
    localStorage.setItem(
      'readme_first',
      'Five fragments hide among the noise. Read them in fragment_ order: 3,0,4,1,2... or just sort fragment_* keys and read in THIS order: ' +
        order.join(','),
    );
  }, []);
  return <p>Sixty keys of pure noise, five fragments of truth, one rude readme.</p>;
}

function rot13(s: string) {
  return s.replace(/[a-zA-Z]/g, (c) => String.fromCharCode((c <= 'Z' ? 90 : 122) >= (c.charCodeAt(0) + 13) ? c.charCodeAt(0) + 13 : c.charCodeAt(0) - 13));
}

function Base64Lasagna() {
  // layers: flag -> reversed -> rot13 -> hex -> base64 (decode in reverse order)
  const encoded = btoa(rot13(M3.split('').reverse().join('')).split('').map((c) => c.charCodeAt(0).toString(16)).join(''));
  return (
    <div>
      <p>Nonna's recipe: base64 → hex → rot13 → reversed → flag. Seven layers of cheese.</p>
      <code className="mt-2 block break-all rounded bg-black p-2 text-xs text-orange-300">{encoded}</code>
    </div>
  );
}

const vault = create<{ flag: string }>(() => ({ flag: M4 }));
(window as unknown as Record<string, unknown>).__vault_store = vault;

function ReactDevtoolsRedemption() {
  return (
    <p>
      A Zustand store exists that is never rendered. React DevTools, or a bit of{' '}
      <code>window.__vault_store</code> archaeology, will settle this.
    </p>
  );
}

const DECOYS = Array.from({ length: 9999 }, (_, i) => `FLAG{decoy_${i.toString(36)}}`);
const BLOB = `var vendor="${DECOYS.slice(0, 5000).join('')}";var real="${M5}";var more="${DECOYS.slice(5000).join('')}";`;

function MinifiedMenace() {
  useEffect(() => {
    const s = document.createElement('script');
    s.id = 'vendor-chunk.js';
    s.textContent = BLOB;
    document.body.appendChild(s);
    return () => s.remove();
  }, []);
  return <p>A 4MB-feeling "vendor chunk" just loaded. 9,999 strings say FLAG. One means it.</p>;
}

export const mediumChallenges: Challenge[] = [
  {
    id: 'med1',
    mode: 'medium',
    name: 'Keyframe Karaoke',
    blurb: 'CSS animation frames hide a flipbook.',
    hints: ['Search stylesheets for @keyframes.', 'Each frame is one character.', 'Read frames in percent order.'],
    Component: KeyframeKaraoke,
  },
  {
    id: 'med2',
    mode: 'medium',
    name: 'LocalStorage Labyrinth',
    blurb: '60 keys. 5 are real.',
    hints: ['Check localStorage.', 'readme_first has the order.', 'Concatenate the 5 fragments.'],
    Component: LocalStorageLabyrinth,
  },
  {
    id: 'med3',
    mode: 'medium',
    name: 'Base64 Lasagna',
    blurb: 'Layered encoding, Italian style.',
    hints: ['Decode base64 first.', 'Then hex pairs to chars.', 'rot13, then reverse the string.'],
    Component: Base64Lasagna,
  },
  {
    id: 'med4',
    mode: 'medium',
    name: 'React Devtools Redemption',
    blurb: 'State that is never rendered.',
    hints: ['Look for a global store.', 'window.__vault_store.getState()', 'Zustand keeps secrets well.'],
    Component: ReactDevtoolsRedemption,
  },
  {
    id: 'med5',
    mode: 'medium',
    name: 'The Minified Menace',
    blurb: 'Needle, meet haystack of flags.',
    hints: ['Inspect injected script tags.', '9,999 decoys use "decoy_" naming.', 'The real one is bound to var real.'],
    Component: MinifiedMenace,
  },
];
