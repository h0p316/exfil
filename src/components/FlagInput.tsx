import { useState } from 'react';

export default function FlagInput({ onSubmit }: { onSubmit: (v: string) => void }) {
  const [value, setValue] = useState('');
  return (
    <form
      className="flex gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        if (value.trim()) onSubmit(value);
      }}
    >
      <input
        className="flex-1 rounded border border-green-800 bg-black px-3 py-2 font-mono text-green-300 outline-none placeholder:text-green-900 focus:border-green-500"
        placeholder="FLAG{...}"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        spellCheck={false}
      />
      <button className="rounded bg-green-700 px-4 py-2 font-mono text-black hover:bg-green-500">
        submit
      </button>
    </form>
  );
}
