import { Link } from 'react-router-dom';
import { sourceProfiles } from '@/data/sources';

interface Props {
  sourceKey: string;
  linked?: boolean;
}

export default function SourceBadge({ sourceKey, linked = true }: Props) {
  const profile = sourceProfiles[sourceKey];
  if (!profile) return null;

  const content = (
    <span
      className="source-badge"
      style={{ borderLeftColor: profile.color, borderLeftWidth: 2 }}
    >
      {profile.shortName}
    </span>
  );

  if (linked) {
    return (
      <Link to={`/sources/${sourceKey}`} className="hover:opacity-80 transition-opacity">
        {content}
      </Link>
    );
  }
  return content;
}
