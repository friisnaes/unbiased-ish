import { sourceProfiles } from '@/data/sources';

interface FrictionItem {
  sourceKey: string;
  youMiss: string;
}

const FRICTION_MAP: Record<string, string> = {
  reuters: 'kontekst og baggrund — wire-rapporter forklarer sjældent hvorfor',
  ap: 'kontekst og dybde — fakta uden forklaring kan mislede',
  bbc: 'modargumentet — vestlig kontekst er ikke det eneste perspektiv',
  aljazeera: 'vestlig institutionel framing — som også former virkeligheden',
  kyivindependent: 'det bredere geopolitiske billede — frontlinjen er ikke hele krigen',
  scmp: 'vestlige og arabiske perspektiver — Kina-vinklen er ét af mange',
  tass: 'alt der ikke tjener Kremls narrativ — og det er meget',
  wion: 'vestlige og kinesiske perspektiver — Indien ser verden fra Delhi',
};

interface Props {
  sourceKeys: string[];
}

export default function FrictionBlock({ sourceKeys }: Props) {
  if (sourceKeys.length < 2) return null;

  const items: FrictionItem[] = sourceKeys
    .filter((sk) => FRICTION_MAP[sk])
    .map((sk) => ({
      sourceKey: sk,
      youMiss: FRICTION_MAP[sk],
    }));

  return (
    <div className="border border-surface-600 rounded-sm bg-surface-800/30 overflow-hidden">
      <div className="px-4 py-3 border-b border-surface-600 bg-surface-800/60">
        <p className="text-xs font-mono text-accent uppercase tracking-[0.15em] font-medium">
          Hvis du kun læser én kilde, misser du:
        </p>
      </div>
      <div className="divide-y divide-surface-700/50">
        {items.map(({ sourceKey, youMiss }) => {
          const profile = sourceProfiles[sourceKey];
          if (!profile) return null;
          return (
            <div key={sourceKey} className="px-4 py-2.5 flex items-start gap-3">
              <span
                className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                style={{ backgroundColor: profile.color }}
              />
              <div className="flex-1 min-w-0">
                <span className="text-xs font-mono text-text-primary font-medium">{profile.shortName}</span>
                <span className="text-xs text-text-tertiary mx-1.5">→</span>
                <span className="text-xs text-text-secondary">{youMiss}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
