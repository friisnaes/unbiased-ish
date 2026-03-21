import { useParams, Link } from 'react-router-dom';
import { useArticles, useClusters, useTopics } from '@/hooks/useData';
import StoryClusterCard from '@/components/StoryClusterCard';
import ArticleCard from '@/components/ArticleCard';
import SectionHeader from '@/components/SectionHeader';

export default function TopicPage() {
  const { topic } = useParams<{ topic: string }>();
  const { articles } = useArticles();
  const { clusters } = useClusters();
  const { topics } = useTopics();

  const topicData = topics.find((t) => t.slug === topic);
  const topicClusters = clusters.filter((c) => c.topicTags.includes(topic || ''));
  const topicArticles = articles.filter((a) => a.topicTags.includes(topic || ''));

  if (!topicData) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center">
        <p className="font-display text-xl text-text-primary mb-4">Emne ikke fundet</p>
        <Link to="/stories" className="text-sm text-accent hover:text-accent-light font-mono">
          ← Tilbage til historier
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        to="/stories"
        className="text-sm text-text-tertiary hover:text-text-primary font-mono transition-colors mb-6 inline-block"
      >
        ← Alle historier
      </Link>

      <SectionHeader
        tag="Emne"
        title={topicData.labelDa}
        subtitle={`${topicData.clusterCount} historier · ${topicData.articleCount} artikler`}
      />

      {topicClusters.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xs font-mono text-text-secondary uppercase tracking-wider mb-6">
            Relaterede historier
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topicClusters.map((c) => (
              <StoryClusterCard key={c.id} cluster={c} articles={articles} />
            ))}
          </div>
        </section>
      )}

      {topicArticles.length > 0 && (
        <section>
          <h2 className="text-xs font-mono text-text-secondary uppercase tracking-wider mb-6">
            Alle artikler i emnet
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {topicArticles.slice(0, 20).map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
