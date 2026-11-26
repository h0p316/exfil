const INSULTS = [
  "That's not a flag. That's barely a string.",
  'The backend could have saved you. There is no backend. Nobody can save you.',
  'Have you tried turning yourself off and on again?',
  'Wow. Confident AND wrong. Inspiring.',
  'I have seen better guesses in a magic 8-ball.',
  'Ctrl+F warriors are not allowed to feel pride.',
  'Somewhere, a linter just cried.',
  'Nope. But points for typing, I guess.',
  'Even the service worker is laughing.',
  'Try again. Or do not. I am a mascot, not your mom.',
];

const LATE_INSULTS = [
  'Ten wrong guesses. I am holding up a tiny sign that says console.log(\'help\').',
  'At this point the flag is hiding from YOU.',
  'I have contacted the fictional backend. It also said no.',
];

const SOLVE_SNARK = [
  'fine. that one was easy anyway.',
  'Congrats. You defeated a div.',
  'I would clap but I am rendered in pixels.',
];

export function wrongGuess(count: number): string {
  const pool = count >= 10 ? [...INSULTS, ...LATE_INSULTS, ...LATE_INSULTS] : INSULTS;
  return pool[Math.floor(Math.random() * pool.length)];
}

export function onSolve(): string {
  return SOLVE_SNARK[Math.floor(Math.random() * SOLVE_SNARK.length)];
}
