import { useGame } from '../core/store';

export default function Mascot({ message }: { message: string }) {
  const wrongGuesses = useGame((s) => s.wrongGuesses);
  return (
    <div className="flex items-start gap-3 rounded border border-purple-900 bg-purple-950/40 p-3">
      <div className="text-3xl" title="Clippy's evil cousin">
        📎
      </div>
      <div className="font-mono text-sm text-purple-200">
        <div className="text-purple-400">Clipp-E (evil cousin)</div>
        <div>{message || 'It looks like you are trying to hack a static site. Would you like help?'}</div>
        {wrongGuesses >= 10 && (
          <div className="mt-2 inline-block rounded bg-yellow-200 px-2 py-1 text-xs text-black">
            console.log('help')
          </div>
        )}
      </div>
    </div>
  );
}
