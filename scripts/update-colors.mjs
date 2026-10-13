import fs from 'fs';
import path from 'path';

const globalsCssPath = path.resolve('C:/Learning/spotify_clone_front/src/styles/globals.css');
let css = fs.readFileSync(globalsCssPath, 'utf8');

// The new palette:
// background: '#121316'
// surface: '#121316'
// surface-dim: '#121316'
// surface-bright: '#38393d'
// surface-container-lowest: '#0d0e11'
// surface-container-low: '#1b1b1f'
// surface-container: '#1f1f23'
// surface-container-high: '#292a2d'
// surface-container-highest: '#343538'
// primary: '#d0bcff'
// secondary: '#5de6ff'
// tertiary: '#ffb869'
// error: '#ffb4ab'
// border: '#494454'

const replacements = [
  { regex: /#08090c/gi, replace: 'var(--bg-primary)' },
  { regex: /#0b0c10/gi, replace: 'var(--bg-secondary)' },
  { regex: /#171a21/gi, replace: 'var(--bg-elevated)' },
  { regex: /#1e222b/gi, replace: 'var(--bg-hover)' },
  { regex: /#13151a/gi, replace: 'var(--bg-soft)' },
  { regex: /#8b5cf6/gi, replace: 'var(--accent-primary)' },
  { regex: /#9d7bff/gi, replace: 'var(--accent-hover)' },
  { regex: /#7047eb/gi, replace: 'var(--accent-active)' },
  { regex: /#22d3ee/gi, replace: 'var(--accent-secondary)' },
  { regex: /#f5f7fa/gi, replace: 'var(--text-primary)' },
  { regex: /#a2a8b3/gi, replace: 'var(--text-secondary)' },
  { regex: /#858c98/gi, replace: 'var(--text-muted)' },
  { regex: /#4c515b/gi, replace: 'var(--text-disabled)' },
  { regex: /#ef4444/gi, replace: 'var(--error)' },
  { regex: /#f59e0b/gi, replace: 'var(--warning)' },
  
  { regex: /#090a0d/gi, replace: 'var(--bg-primary)' },
  { regex: /#090a0e/gi, replace: 'var(--bg-primary)' },
  { regex: /#191b23/gi, replace: 'var(--bg-elevated)' },
  { regex: /#343744/gi, replace: 'var(--bg-soft)' },
  { regex: /#15171dcc/gi, replace: 'color-mix(in srgb, var(--bg-secondary) 80%, transparent)' },
  { regex: /#061016/gi, replace: '#121316' },
  { regex: /#d7c5ff/gi, replace: 'var(--accent-primary)' },
  { regex: /#ffaaaa/gi, replace: 'var(--error)' },
  { regex: /#d9c8ff/gi, replace: 'var(--accent-primary)' },
  { regex: /#d5c2ff/gi, replace: 'var(--accent-primary)' },
  { regex: /#cab7ff/gi, replace: 'var(--accent-primary)' },
  { regex: /#c9aeff/gi, replace: 'var(--accent-primary)' },
  { regex: /#c6a9ff/gi, replace: 'var(--accent-primary)' },
  { regex: /#d3c0ff/gi, replace: 'var(--accent-primary)' },
  { regex: /#7c3aed/gi, replace: 'var(--accent-primary)' },
  { regex: /#7540d8/gi, replace: 'var(--accent-active)' },
  { regex: /#251343/gi, replace: '#3c0091' }, // on-primary
  { regex: /#ff8a8a/gi, replace: 'var(--error)' },
  { regex: /#15171d/gi, replace: 'var(--bg-secondary)' },
  { regex: /#171a21/gi, replace: 'var(--bg-elevated)' },
  { regex: /rgba\(139, 92, 246/gi, replace: 'rgba(208, 188, 255' }, // 8b5cf6 -> d0bcff (rgb: 208, 188, 255)
  { regex: /rgba\(34, 211, 238/gi, replace: 'rgba(93, 230, 255' }, // 22d3ee -> 5de6ff (rgb: 93, 230, 255)
  { regex: /rgba\(198, 169, 255/gi, replace: 'rgba(233, 221, 255' } // c6a9ff -> e9ddff (rgb: 233, 221, 255)
];

for (const r of replacements) {
  css = css.replace(r.regex, r.replace);
}

fs.writeFileSync(globalsCssPath, css, 'utf8');
console.log('globals.css updated with Nocturne variables.');

