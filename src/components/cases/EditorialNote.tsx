import { formatDate } from '@/utils/format';

interface Props {
  note?: string;
  sources: string[];
  topics: string[];
  updatedAt: string;
}

export default function EditorialNote({ note, sources, topics, updatedAt }: Props) {
  return (
    <div className="border-t border-surface-700/50 pt-4 mt-4">
      <details className="group">
        <summary className="text-xs font-mono text-text-tertiary cursor-pointer hover:text-text-secondary transition-colors select-none">
          Redaktionel transparens ↓
        </summary>
        <div className="mt-3 space-y-2 text-xs text-text-tertiary">
          {note && <p><span className="text-text-secondary">Hvorfor denne case:</span> {note}</p>}
          <p><span className="text-text-secondary">Inkluderede kilder:</span> {sources.join(', ')}</p>
          <p><span className="text-text-secondary">Emner:</span> {topics.join(', ')}</p>
          <p><span className="text-text-secondary">Sidst opdateret:</span> {formatDate(updatedAt)}</p>
          <p className="italic">
            Signal Engine™ klassificering er automatisk og baseret på metadata. Den kan indeholde fejl.
          </p>
        </div>
      </details>
    </div>
  );
}
