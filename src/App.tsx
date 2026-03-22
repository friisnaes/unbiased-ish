import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from '@/components/Layout';
import HomePage from '@/pages/HomePage';
import StoriesPage from '@/pages/StoriesPage';
import StoryDetailPage from '@/pages/StoryDetailPage';
import SourcesPage from '@/pages/SourcesPage';
import SourceDetailPage from '@/pages/SourceDetailPage';
import TopicPage from '@/pages/TopicPage';
import MethodologyPage from '@/pages/MethodologyPage';
import AboutPage from '@/pages/AboutPage';
import LegalPage from '@/pages/LegalPage';
import BriefingPage from '@/pages/BriefingPage';
import SearchPage from '@/pages/SearchPage';

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="briefing" element={<BriefingPage />} />
          <Route path="stories" element={<StoriesPage />} />
          <Route path="stories/:slug" element={<StoryDetailPage />} />
          <Route path="sources" element={<SourcesPage />} />
          <Route path="sources/:sourceKey" element={<SourceDetailPage />} />
          <Route path="topics/:topic" element={<TopicPage />} />
          <Route path="methodology" element={<MethodologyPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="legal" element={<LegalPage />} />
          <Route path="search" element={<SearchPage />} />
          <Route
            path="*"
            element={
              <div className="max-w-5xl mx-auto px-4 py-20 text-center">
                <p className="font-display text-2xl text-text-primary mb-4">404</p>
                <p className="text-text-secondary">Side ikke fundet.</p>
              </div>
            }
          />
        </Route>
      </Routes>
    </HashRouter>
  );
}
