import { useState } from 'react';
import confetti from 'canvas-confetti';
import type { Challenge } from '../challenges/types';
import { validateFlag } from '../core/flagValidator';
import { onSolve, wrongGuess } from '../core/snarkEngine';
import { HINT_LIMIT, useGame } from '../core/store';
import FlagInput from './FlagInput';
import Mascot from './Mascot';

export default function ChallengePage({ challenge }: { challenge: Challenge }) {
  const { solved, usedHints, solve, wrongGuess: recordWrong, useHint } = useGame();
  const [mascotMsg, setMascotMsg] = useState('');
  const [revealed, setRevealed] = useState(0);
  const isSolved = !!solved[challenge.id];
  const hintsUsed = usedHints[challenge.id] ?? 0;
  const hintCap = Math.min(HINT_LIMIT[challenge.mode], challenge.hints.length);

  const submit = async (attempt: string) => {
    if (isSolved) return;
    if (await validateFlag(challenge.id, attempt)) {
      const pts = solve(challenge.id, challenge.mode);
      confetti({ particleCount: 160, spread: 80 });
      setMascotMsg(`${onSolve()} (+${pts} pts)`);
    } else {
      recordWrong();
      setMascotMsg(wrongGuess(useGame.getState().wrongGuesses));
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-mono text-xl text-green-300">{challenge.name}</h2>
        <p className="text-sm text-neutral-400">{challenge.blurb}</p>
      </div>
      <div className="rounded border border-neutral-800 bg-neutral-900/50 p-4">
        <challenge.Component />
      </div>
      <FlagInput onSubmit={submit} />
      <div className="flex flex-wrap items-center gap-2">
        <button
          disabled={isSolved || revealed >= hintCap}
          onClick={() => {
            setRevealed((r) => r + 1);
            useHint(challenge.id, challenge.mode);
          }}
          className="rounded border border-yellow-700 px-3 py-1 font-mono text-xs text-yellow-300 disabled:opacity-30"
        >
          hint ({hintsUsed}/{hintCap} used)
        </button>
        {challenge.hints.slice(0, revealed).map((h, i) => (
          <span key={i} className="rounded bg-yellow-950 px-2 py-1 font-mono text-xs text-yellow-200">
            {h}
          </span>
        ))}
      </div>
      <Mascot message={mascotMsg} />
      {isSolved && <div className="font-mono text-green-400">✔ solved — {solved[challenge.id].points} pts</div>}
    </div>
  );
}
