import { useState, useEffect } from 'react';
import type { Article, StoryCluster, SiteConfig, IngestionRun, Topic } from '@/types';

const BASE = import.meta.env.BASE_URL || '/';

async function fetchJSON<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}data/${path}`);
  if (!res.ok) throw new Error(`Failed to load ${path}: ${res.status}`);
  return res.json();
}

export function useArticles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchJSON<Article[]>('articles.json')
      .then(setArticles)
      .catch(() => setArticles([]))
      .finally(() => setLoading(false));
  }, []);
  return { articles, loading };
}

export function useClusters() {
  const [clusters, setClusters] = useState<StoryCluster[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchJSON<StoryCluster[]>('clusters.json')
      .then(setClusters)
      .catch(() => setClusters([]))
      .finally(() => setLoading(false));
  }, []);
  return { clusters, loading };
}

export function useTopics() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchJSON<Topic[]>('topics.json')
      .then(setTopics)
      .catch(() => setTopics([]))
      .finally(() => setLoading(false));
  }, []);
  return { topics, loading };
}

export function useSiteConfig() {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  useEffect(() => {
    fetchJSON<SiteConfig>('config.json')
      .then(setConfig)
      .catch(() => setConfig(null));
  }, []);
  return config;
}

export function useIngestionLog() {
  const [log, setLog] = useState<IngestionRun[]>([]);
  useEffect(() => {
    fetchJSON<IngestionRun[]>('ingestion-log.json')
      .then(setLog)
      .catch(() => setLog([]));
  }, []);
  return log;
}
