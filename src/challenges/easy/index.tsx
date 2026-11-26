import { useEffect, useRef } from 'react';
import type { Challenge } from '../types';

const F1 = 'FLAG{d3f1n1t3ly_n0t_th3_fl4g}';
const F2 = 'FLAG{c0ns0l3_c0wb0y_r1d3s_4g41n}';
const F3 = 'FLAG{d1splay_n0n3_m0r3_l1k3_d1splay_w0n}';
const F5 = 'FLAG{c00k13_crumb5_l34d_h0m3}';

function ViewSourceOrigins() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (el && ![...el.childNodes].some((n) => n.nodeType === 8)) {
      el.prepend(document.createComment(` definitely not the flag -> ${F1} `));
    }
  }, []);
  return (
    <div ref={ref}>
      <p>Nothing to see here. Totally ordinary page. Have you tried admiring it as rendered?</p>
      <mark className="hidden">{F1}</mark>
    </div>
  );
}

function ConsoleCowboy() {
  useEffect(() => {
    console.warn('[warn] hydration is a scam');
    console.warn('[warn] react emoji is crying');
    for (let i = 0; i < 44; i++) console.warn(`[warn] deprecated thing #${i}`);
    console.log(`howdy partner ${F2}`);
    console.warn('[warn] you were warned');
  }, []);
  return <p>A quiet, innocent component. Check the console, cowboy.</p>;
}

function InvisibleDiv() {
  return (
    <div>
      <p>It is transparent, like our roadmap.</p>
      <div style={{ display: 'none' }} data-secret="nope">
        {F3}
      </div>
    </div>
  );
}

function RobotsTxt() {
  return (
    <p>
      We are very SEO-friendly. Try <code className="text-cyan-300">/robots.txt</code>. Surely nothing
      is disallowed.
    </p>
  );
}

function CookieMonster() {
  useEffect(() => {
    const decoys = ['snacc=choc_chip', 'mood=hungry', 'definitely_a_flag=FLAG{nice_try}', 'session=nom'];
    document.cookie = `${decoys.join('; ')}; crumb=${F5}; path=/`;
    document.cookie = decoys.join('; ') + '; path=/';
    document.cookie = `crumb=${F5}; path=/`;
  }, []);
  return <p>The mascot keeps eating cookies. Catch the right crumb in <code>document.cookie</code>.</p>;
}

export const easyChallenges: Challenge[] = [
  {
    id: 'easy1',
    mode: 'easy',
    name: 'View Source: Origins',
    blurb: 'Right-click is a love language.',
    hints: ['Try "View Page Source".', 'HTML comments can talk.', 'Look for "definitely not the flag".'],
    Component: ViewSourceOrigins,
  },
  {
    id: 'easy2',
    mode: 'easy',
    name: 'Console Cowboy',
    blurb: 'The console is screaming. Somewhere in there is a flag.',
    hints: ['Open DevTools console.', 'Buried between warnings.', 'It says "howdy".'],
    Component: ConsoleCowboy,
  },
  {
    id: 'easy3',
    mode: 'easy',
    name: 'The Invisible Div',
    blurb: 'Some elements prefer privacy.',
    hints: ['Inspect the DOM.', 'display:none is a lifestyle.', 'Toggle the style off.'],
    Component: InvisibleDiv,
  },
  {
    id: 'easy4',
    mode: 'easy',
    name: 'robots.txt???',
    blurb: 'Crawlers welcome. Flags disallowed.',
    hints: ['Visit /robots.txt.', 'Disallow lines can smuggle things.', 'Googlebot already found it.'],
    Component: RobotsTxt,
  },
  {
    id: 'easy5',
    mode: 'easy',
    name: 'Cookie Monster',
    blurb: 'The browser is full of crumbs.',
    hints: ['document.cookie', 'Application tab > Cookies.', 'Look for the "crumb".'],
    Component: CookieMonster,
  },
];
