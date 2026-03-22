import type { StoryCluster } from '@/types';
import { sourceProfiles } from '@/data/sources';

interface Props {
  clusters: StoryCluster[];
}

const sourceOrder = ['reuters', 'ap', 'bbc', 'aljazeera', 'kyivindependent', 'scmp', 'tass', 'wion'] as const;

export default function CoverageMatrix({ clusters }: Props) {
  const top = clusters.slice(0, 8);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-surface-600">
            <th className="text-left py-3 pr-4 font-body font-medium text-text-secondary text-xs uppercase tracking-wider">
              Historie
            </th>
            {sourceOrder.map((sk) => (
              <th
                key={sk}
                className="px-3 py-3 text-center font-mono text-xs text-text-tertiary uppercase tracking-wider"
              >
                {sourceProfiles[sk]?.shortName}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {top.map((cluster) => (
            <tr
              key={cluster.id}
              className="border-b border-surface-700/50 hover:bg-surface-800/50 transition-colors"
            >
              <td className="py-3 pr-4 max-w-xs">
                <span className="text-text-primary font-body text-sm line-clamp-1">
                  {cluster.title}
                </span>
              </td>
              {sourceOrder.map((sk) => {
                const covered = cluster.sourceKeys.includes(sk);
                return (
                  <td key={sk} className="px-3 py-3 text-center">
                    {covered ? (
                      <span
                        className="inline-block w-3 h-3 rounded-full"
                        style={{
                          backgroundColor: sourceProfiles[sk]?.color || '#666',
                          opacity: 0.85,
                        }}
                      />
                    ) : (
                      <span className="inline-block w-3 h-3 rounded-full bg-surface-700" />
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
