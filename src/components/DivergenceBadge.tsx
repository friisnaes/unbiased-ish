import type { DivergenceLevel } from '@/types';
import { divergenceColor, divergenceBg, divergenceLabelDa } from '@/utils/format';

interface Props {
  level: DivergenceLevel;
  score?: number;
  compact?: boolean;
}

export default function DivergenceBadge({ level, score, compact }: Props) {
  if (compact) {
    return (
      <span
        className={`inline-flex items-center gap-1 text-xs font-mono ${divergenceColor(level)}`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-current" />
        {divergenceLabelDa(level)}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-sm text-xs font-mono ${divergenceColor(level)} ${divergenceBg(level)}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {divergenceLabelDa(level)}
      {score !== undefined && (
        <span className="text-text-tertiary ml-1">
          {Math.round(score * 100)}%
        </span>
      )}
    </span>
  );
}
