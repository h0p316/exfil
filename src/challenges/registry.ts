import { easyChallenges } from './easy';
import { mediumChallenges } from './medium';
import { hardChallenges } from './hard';
import type { Challenge } from './types';
import type { Mode } from '../core/store';

export const ALL_CHALLENGES: Challenge[] = [...easyChallenges, ...mediumChallenges, ...hardChallenges];

export const byMode = (mode: Mode) => ALL_CHALLENGES.filter((c) => c.mode === mode);
export const byId = (id: string) => ALL_CHALLENGES.find((c) => c.id === id);
