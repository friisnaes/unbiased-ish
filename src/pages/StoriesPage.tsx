import { useState, useMemo } from 'react';
import { useArticles, useClusters, useTopics } from '@/hooks/useData';
import StoryClusterCard from '@/components/StoryClusterCard';
import SectionHeader from '@/components/SectionHeader';
import type { DivergenceLevel } from '@/types';

export default function StoriesPage() {
  const { articles } = useArticles();
  const { clusters, loading } = useClusters();
  const { topics } = useTopics();

  const [sortBy, setSortBy] = useState<'recent' | 'divergence'>('recent');
  const [filterTopic, setFilterTopic] = useState<string>('');
  const [filterDiv, setFilterDiv] = useState<DivergenceLevel | ''>('');

  const filtered = useMemo(() => {
    let list = [...clusters];

    if (filterTopic) {
      list = list.filter((c) => c.topicTags.includes(filterTopic));
    }
    if (filterDiv) {
      list = list.filter((c) => c.divergenceLevel === filterDiv);
    }
    if (sortBy === 'recent') {
      list.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    } else {
      list.sort((a, b) => b.divergenceScore - a.divergenceScore);
    }
    return list;
  }, [clusters, sortBy, filterTopic, filterDiv]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <SectionHeader
        tag="Alle historier"
        title="Historier under observation"
        subtitle="Hver historie samler dækning fra flere kilder. Sortér efter tid eller divergens for at finde det mest interessante."
      />

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-8">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'recent' | 'divergence')}
          className="bg-surface-700 border border-surface-600 text-text-primary text-sm rounded-sm px-3 py-1.5 font-mono focus:outline-none focus:border-accent"
        >
          <option value="recent">Nyeste først</option>
          <option value="divergence">Højeste divergens</option>
        </select>

        <select
          value={filterDiv}
          onChange={(e) => setFilterDiv(e.target.value as DivergenceLevel | '')}
          className="bg-surface-700 border border-surface-600 text-text-primary text-sm rounded-sm px-3 py-1.5 font-mono focus:outline-none focus:border-accent"
        >
          <option value="">Alle divergensniveauer</option>
          <option value="high">Høj divergens</option>
          <option value="moderate">Moderat divergens</option>
          <option value="low">Lav divergens</option>
        </select>

        <select
          value={filterTopic}
          onChange={(e) => setFilterTopic(e.target.value)}
          className="bg-surface-700 border border-surface-600 text-text-primary text-sm rounded-sm px-3 py-1.5 font-mono focus:outline-none focus:border-accent"
        >
          <option value="">Alle emner</option>
          {topics.map((t) => (
            <option key={t.slug} value={t.slug}>
              {t.labelDa} ({t.articleCount})
            </option>
          ))}
        </select>

        <span className="text-xs font-mono text-text-tertiary self-center ml-2">
          {filtered.length} historier
        </span>
      </div>

      {loading ? (
        <div className="text-center py-20 text-text-tertiary font-mono text-sm">
          Indlæser historier...
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-text-tertiary">
          <p className="font-display text-lg mb-2">Ingen historier fundet</p>
          <p className="text-sm">Prøv at justere filtrene.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((c) => (
            <StoryClusterCard key={c.id} cluster={c} articles={articles} />
          ))}
        </div>
      )}
    </div>
  );
}
