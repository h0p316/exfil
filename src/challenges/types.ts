import type { ComponentType } from 'react';
import type { Mode } from '../core/store';

export interface Challenge {
  id: string;
  mode: Mode;
  name: string;
  blurb: string;
  hints: string[];
  Component: ComponentType;
}
