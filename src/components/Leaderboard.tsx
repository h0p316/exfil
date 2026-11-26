import { useGame } from '../core/store';

export default function Leaderboard() {
  const { score, solved, wrongGuesses } = useGame();
  return (
    <div className="rounded border border-cyan-900 bg-cyan-950/30 p-4 font-mono text-sm">
      <h3 className="mb-2 text-cyan-300">Global Leaderboard (population: you)</h3>
      <div className="flex justify-between text-cyan-100">
        <span>1. you (anonymous coward)</span>
        <span>{score} pts</span>
      </div>
      <div className="mt-2 text-xs text-cyan-600">
        {Object.keys(solved).length}/15 solved · {wrongGuesses} wrong guesses
      </div>
    </div>
  );
}
