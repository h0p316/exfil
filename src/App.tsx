import { HashRouter, Link, Route, Routes, useParams } from 'react-router-dom';
import ChallengePage from './components/ChallengePage';
import FakeTerminal from './components/FakeTerminal';
import Leaderboard from './components/Leaderboard';
import { byId, byMode } from './challenges/registry';
import { MODE_POINTS, useGame, type Mode } from './core/store';

const MODES: { mode: Mode; emoji: string; tagline: string }[] = [
  { mode: 'easy', emoji: '🟢', tagline: "DevTools? What's DevTools?" },
  { mode: 'medium', emoji: '🟡', tagline: 'Oh, you know console.log. How elite.' },
  { mode: 'hard', emoji: '🔴', tagline: 'Your browser is about to file a restraining order.' },
];

function Home() {
  return (
    <div className="space-y-6">
      <header>
        <div className="font-mono text-xs tracking-widest text-green-800">
          [ session :: node://localhost ] ──────────────────
        </div>
        <h1 className="mt-1 font-mono text-3xl text-green-400">🚩 FLAGGED FOR DELETION</h1>
        <p className="mt-1 text-neutral-400">
          There is no backend. There is no mercy. There is only JavaScript.
          <span className="blink text-green-500">▌</span>
        </p>
      </header>
      <FakeTerminal />
      <div className="grid gap-4 md:grid-cols-3">
        {MODES.map(({ mode, emoji, tagline }) => (
          <Link
            key={mode}
            to={`/${mode}`}
            className="rounded border border-neutral-800 bg-neutral-900/50 p-4 hover:border-green-700"
          >
            <div className="text-2xl">{emoji}</div>
            <div className="font-mono text-lg capitalize text-green-300">{mode}</div>
            <div className="mt-1 text-xs text-neutral-400">{tagline}</div>
            <div className="mt-2 font-mono text-xs text-neutral-500">
              5 challenges · {MODE_POINTS[mode]} pts each
            </div>
          </Link>
        ))}
      </div>
      <Leaderboard />
    </div>
  );
}

function ModePage({ mode }: { mode: Mode }) {
  const solved = useGame((s) => s.solved);
  return (
    <div className="space-y-4">
      <Link to="/" className="font-mono text-sm text-neutral-500 hover:text-green-400">
        ← back
      </Link>
      <h2 className="font-mono text-2xl capitalize text-green-300">{mode} mode</h2>
      <ul className="space-y-2">
        {byMode(mode).map((c, i) => (
          <li key={c.id}>
            <Link
              to={`/challenge/${c.id}`}
              className="flex items-center justify-between rounded border border-neutral-800 bg-neutral-900/50 px-4 py-3 hover:border-green-700"
            >
              <span className="font-mono text-green-200">
                #{i + 1} {c.name}
              </span>
              <span className="font-mono text-xs text-neutral-500">
                {solved[c.id] ? '✔ solved' : `${MODE_POINTS[c.mode]} pts`}
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <Leaderboard />
    </div>
  );
}

function ChallengeRoute() {
  const { id } = useParams();
  const challenge = id ? byId(id) : undefined;
  if (!challenge) return <p className="font-mono text-red-400">unknown challenge</p>;
  return (
    <div className="space-y-4">
      <Link to={`/${challenge.mode}`} className="font-mono text-sm text-neutral-500 hover:text-green-400">
        ← {challenge.mode}
      </Link>
      <ChallengePage challenge={challenge} />
    </div>
  );
}

export default function App() {
  return (
    <HashRouter>
      <div className="mx-auto max-w-3xl p-6 text-neutral-200">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/easy" element={<ModePage mode="easy" />} />
          <Route path="/medium" element={<ModePage mode="medium" />} />
          <Route path="/hard" element={<ModePage mode="hard" />} />
          <Route path="/challenge/:id" element={<ChallengeRoute />} />
        </Routes>
      </div>
    </HashRouter>
  );
}
