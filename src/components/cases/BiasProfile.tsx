import { useState } from 'react';
import { Link } from 'react-router-dom';
import { sourceProfiles } from '@/data/sources';

interface BiasEntry {
  label: string;
  level: 'low' | 'medium' | 'high';
}

const BIAS_DATA: Record<string, { role: string; biases: BiasEntry[]; strength: string; caution: string }> = {
  reuters: {
    role: 'Rå fakta — hvad er sket',
    strength: 'Hurtig, bred, faktuel baseline',
    caution: 'Vestlig redaktionel prioritering i valg af historier',
    biases: [
      { label: 'Geografisk', level: 'medium' },
      { label: 'Politisk', level: 'low' },
      { label: 'Institutionel', level: 'low' },
      { label: 'Kommerciel', level: 'medium' },
      { label: 'Konfliktnærhed', level: 'low' },
    ],
  },
  ap: {
    role: 'Rå fakta — bekræftede facts',
    strength: 'Dyb faktuel standard, stærk fotojournalistik',
    caution: 'Amerikansk perspektiv i prioritering',
    biases: [
      { label: 'Geografisk', level: 'medium' },
      { label: 'Politisk', level: 'low' },
      { label: 'Institutionel', level: 'low' },
      { label: 'Kommerciel', level: 'low' },
      { label: 'Konfliktnærhed', level: 'low' },
    ],
  },
  bbc: {
    role: 'Kontekst — hvorfor det betyder noget',
    strength: 'Stærk kontekstualisering og forklaring',
    caution: 'Vestlig institutionel bias, britisk udsyn',
    biases: [
      { label: 'Geografisk', level: 'medium' },
      { label: 'Politisk', level: 'medium' },
      { label: 'Institutionel', level: 'high' },
      { label: 'Kommerciel', level: 'low' },
      { label: 'Konfliktnærhed', level: 'low' },
    ],
  },
  aljazeera: {
    role: 'Modperspektiv — hvordan det ses anderledes',
    strength: 'Ikke-vestligt perspektiv, stærk på Mellemøsten',
    caution: 'Qatar-statsfinanseret, selektiv kritik',
    biases: [
      { label: 'Geografisk', level: 'high' },
      { label: 'Politisk', level: 'high' },
      { label: 'Institutionel', level: 'high' },
      { label: 'Kommerciel', level: 'medium' },
      { label: 'Konfliktnærhed', level: 'medium' },
    ],
  },
  kyivindependent: {
    role: 'Lokal virkelighed — frontlinjeperspektiv',
    strength: 'Unik frontlinjeindsigt fra Ukraine',
    caution: 'Ukrainsk national vinkel, krigsrelateret bias',
    biases: [
      { label: 'Geografisk', level: 'high' },
      { label: 'Politisk', level: 'medium' },
      { label: 'Institutionel', level: 'low' },
      { label: 'Kommerciel', level: 'low' },
      { label: 'Konfliktnærhed', level: 'high' },
    ],
  },
  scmp: {
    role: 'Kina-perspektiv — Beijings vinkel',
    strength: 'Bedste engelsksprogede vindue til kinesisk tænkning',
    caution: 'Ejet af Alibaba, selvcensur på sensitive emner',
    biases: [
      { label: 'Geografisk', level: 'high' },
      { label: 'Politisk', level: 'high' },
      { label: 'Institutionel', level: 'high' },
      { label: 'Kommerciel', level: 'high' },
      { label: 'Konfliktnærhed', level: 'low' },
    ],
  },
  tass: {
    role: 'Russisk statsnarrativ — Kremls framing',
    strength: 'Direkte indsigt i russisk officiel position',
    caution: 'Statsligt kontrolleret, propaganda til stede',
    biases: [
      { label: 'Geografisk', level: 'high' },
      { label: 'Politisk', level: 'high' },
      { label: 'Institutionel', level: 'high' },
      { label: 'Kommerciel', level: 'medium' },
      { label: 'Konfliktnærhed', level: 'high' },
    ],
  },
  wion: {
    role: 'Global South — indisk/BRICS-perspektiv',
    strength: 'Repræsenterer indisk og BRICS-perspektiv',
    caution: 'Indisk nationalistisk undertone',
    biases: [
      { label: 'Geografisk', level: 'high' },
      { label: 'Politisk', level: 'medium' },
      { label: 'Institutionel', level: 'medium' },
      { label: 'Kommerciel', level: 'medium' },
      { label: 'Konfliktnærhed', level: 'low' },
    ],
  },
};

function BiasBar({ level }: { level: 'low' | 'medium' | 'high' }) {
  const colors = {
    low: 'bg-divergence-low',
    medium: 'bg-divergence-moderate',
    high: 'bg-divergence-high',
  };
  const widths = { low: 'w-1/4', medium: 'w-1/2', high: 'w-3/4' };
  const labels = { low: 'Lav', medium: 'Medium', high: 'Høj' };
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-surface-700 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${colors[level]} ${widths[level]}`} />
      </div>
      <span className="text-xs text-text-tertiary font-mono w-12">{labels[level]}</span>
    </div>
  );
}

interface Props {
  sourceKey: string;
  compact?: boolean;
}

export default function BiasProfile({ sourceKey, compact }: Props) {
  const [expanded, setExpanded] = useState(false);
  const profile = sourceProfiles[sourceKey];
  const bias = BIAS_DATA[sourceKey];
  if (!profile || !bias) return null;

  if (compact) {
    return (
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left"
      >
        <div className="flex items-center gap-2 text-xs">
          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: profile.color }} />
          <span className="font-mono text-text-secondary font-medium">{profile.shortName}</span>
          <span className="text-text-tertiary">— {bias.role}</span>
          <span className="ml-auto text-text-tertiary">{expanded ? '−' : '+'}</span>
        </div>
        {expanded && (
          <div className="mt-3 pl-4 space-y-2">
            <p className="text-xs text-divergence-low">+ {bias.strength}</p>
            <p className="text-xs text-divergence-moderate">⚠ {bias.caution}</p>
            <div className="space-y-1.5 mt-2">
              {bias.biases.map((b) => (
                <div key={b.label} className="flex items-center gap-2">
                  <span className="text-xs text-text-tertiary w-28">{b.label}</span>
                  <BiasBar level={b.level} />
                </div>
              ))}
            </div>
          </div>
        )}
      </button>
    );
  }

  return (
    <div className="border border-surface-600 rounded-sm p-5 bg-surface-800/30">
      <div className="flex items-center gap-2 mb-3">
        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: profile.color }} />
        <Link to={`/sources/${sourceKey}`} className="font-display font-semibold text-text-primary hover:text-accent-light transition-colors">
          {profile.name}
        </Link>
        <span className="text-xs font-mono text-text-tertiary ml-auto">{profile.country}</span>
      </div>
      <p className="text-sm font-mono text-accent mb-3">{bias.role}</p>
      <p className="text-xs text-divergence-low mb-1">+ {bias.strength}</p>
      <p className="text-xs text-divergence-moderate mb-4">⚠ {bias.caution}</p>
      <div className="space-y-2">
        {bias.biases.map((b) => (
          <div key={b.label} className="flex items-center gap-2">
            <span className="text-xs text-text-tertiary w-28">{b.label}</span>
            <BiasBar level={b.level} />
          </div>
        ))}
      </div>
    </div>
  );
}
