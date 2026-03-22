import { Link } from 'react-router-dom';
import type { StoryCluster, Article } from '@/types';
import { timeAgo } from '@/utils/format';
import ConfidenceIndicator, { deriveConfidence, deriveConfidenceExplanation } from './ConfidenceIndicator';
import DisagreementHeat from './DisagreementHeat';
import SourceCard from './SourceCard';
import SignalBlock from './SignalBlock';
import SoWhatBlock from './SoWhatBlock';
import FrictionBlock from './FrictionBlock';
import EditorialNote from './EditorialNote';

const SOURCE_ROLES: Record<string, string> = {
  reuters: 'Fakta', ap: 'Fakta', bbc: 'Kontekst',
  aljazeera: 'Modperspektiv', kyivindependent: 'Frontlinje',
  scmp: 'Kina-vinkel', tass: 'Russisk stat', wion: 'Global South',
};

interface Props {
  cluster: StoryCluster;
  articles: Article[];
  featured?: boolean;
}

export default function CaseBlock({ cluster, articles, featured }: Props) {
  const clusterArticles = articles.filter((a) => cluster.articleIds.includes(a.id));
  const bySource = new Map<string, Article[]>();
  for (const a of clusterArticles) {
    if (!bySource.has(a.sourceKey)) bySource.set(a.sourceKey, []);
    bySource.get(a.sourceKey)!.push(a);
  }

  const confidence = deriveConfidence(cluster.coverageCount, cluster.divergenceScore);
  const confidenceExp = cluster.confidenceExplanation || deriveConfidenceExplanation(cluster.coverageCount, cluster.divergenceScore);
  const hasSignal = cluster.synthesisKnown && cluster.synthesisKnown.length > 0;
  const hasSoWhat = cluster.soWhatConclude && cluster.soWhatConclude.length > 0;
  const pad = featured ? '' : 'px-5';

  return (
    <div className={featured ? '' : 'border border-surface-600 rounded-sm bg-surface-800/10 overflow-hidden'}>
      {/* ── Header ── */}
      <div className={featured ? 'mb-4' : 'p-5 pb-3'}>
        <div className="flex items-center gap-2.5 mb-3 flex-wrap">
          <ConfidenceIndicator level={confidence} compact />
          <DisagreementHeat score={cluster.divergenceScore} compact />
          <span className="text-xs font-mono text-text-tertiary ml-auto">
            {cluster.coverageCount} kilder · {timeAgo(cluster.updatedAt)}
          </span>
        </div>
        <Link to={`/stories/${cluster.slug}`}>
          <h2 className={`font-display font-bold text-text-primary leading-tight hover:text-accent-light transition-colors ${featured ? 'text-2xl md:text-3xl' : 'text-lg'}`}>
            {cluster.title}
          </h2>
        </Link>
      </div>

      <div className={pad}>
        {/* ══ 1. SIGNAL ENGINE — VISUELT DOMINERENDE, FØRST ══ */}
        {hasSignal && (
          <div className="mb-4">
            <SignalBlock
              confirmed={cluster.synthesisKnown!}
              disputed={cluster.synthesisDisputed || []}
              unknown={cluster.synthesisUnclear || []}
              sourceCount={cluster.coverageCount}
              divergenceScore={cluster.divergenceScore}
            />
          </div>
        )}

        {/* ══ 2. CONFIDENCE MED FORKLARING ══ */}
        <div className="mb-4">
          <ConfidenceIndicator level={confidence} explanation={confidenceExp} />
        </div>

        {/* ══ 3. SO WHAT — ANVENDELSESVÆRDI ══ */}
        {hasSoWhat && (
          <div className="mb-4">
            <SoWhatBlock
              canConclude={cluster.soWhatConclude!}
              beCareful={cluster.soWhatCareful || []}
            />
          </div>
        )}

        {/* ══ 4. SOURCE TRIANGULATION ══ */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 ${featured ? 'lg:grid-cols-3' : 'lg:grid-cols-3'} gap-2.5 mb-4`}>
          {cluster.sourceKeys.map((sk) => (
            <SourceCard
              key={sk}
              sourceKey={sk}
              role={SOURCE_ROLES[sk] || 'Kilde'}
              articles={bySource.get(sk)?.slice(0, 1) || []}
            />
          ))}
        </div>

        {/* ══ 5. FRICTION ══ */}
        {cluster.coverageCount >= 3 && (
          <div className="mb-4">
            <FrictionBlock sourceKeys={cluster.sourceKeys} />
          </div>
        )}

        {/* ── Analysis fallback ── */}
        {!hasSignal && cluster.clusterAnalysisDa && (
          <div className="border border-surface-600 rounded-sm p-4 bg-surface-800/30 mb-4">
            <p className="text-xs font-mono text-text-tertiary uppercase tracking-wider mb-2">Analyse</p>
            <p className="text-sm text-text-secondary leading-relaxed">{cluster.clusterAnalysisDa}</p>
          </div>
        )}
      </div>

      {/* ══ 6. EDITORIAL TRANSPARENCY ══ */}
      <div className={featured ? '' : 'px-5 pb-5'}>
        <EditorialNote
          note={cluster.editorialNote}
          sources={cluster.sourceKeys}
          topics={cluster.topicTags}
          updatedAt={cluster.updatedAt}
        />
      </div>
    </div>
  );
}
