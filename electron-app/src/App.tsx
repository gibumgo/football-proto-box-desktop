import { useState, useEffect, useCallback } from 'react';
import { Matches } from './pages/Matches';
import { Dashboard } from './pages/Dashboard';
import { CrawlerDashboard } from './pages/CrawlerDashboard';
import { ArchiveDashboard } from './pages/ArchiveDashboard';
import { TeamProfile } from './pages/TeamProfile';
import { Match } from './domain/models/match/Match';
import { MatchMapper } from './domain/mappers/MatchMapper';
import type { MatchDto } from './types';
import { NEON_THEME } from './domain/design/designTokens';
import { TEXTS } from './constants/uiTexts';
import './App.css';

// Layout Components
import { AppLayout } from './components/layout/AppLayout';
import { Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';

type Page = 'dashboard' | 'leagues' | 'matches' | 'favorites' | 'strategy' | 'odds-flow' | 'archive' | 'crawler' | 'team-profile' | 'tools' | 'settings';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [data, setData] = useState<Match[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<string>('');

  // Global UI State
  const [signalMode, setSignalMode] = useState(false);
  const [density, setDensity] = useState<'compact' | 'comfortable'>('comfortable');

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      if (!window.api) {
        console.warn('window.api가 없습니다. 목 데이터를 사용합니다.');
        const mockData: MatchDto[] = [
          {
            round: 1234,
            matchNo: 1,
            dateTime: '2025-12-17T15:00:00',
            league: 'EPL',
            home: '맨체스터 유나이티드',
            away: '첼시',
            type: 'GENERAL',
            winOdd: 2.10,
            drawOdd: 3.20,
            loseOdd: 3.50,
            result: '승',
            resultOdd: 2.10,
            score: { home: 2, away: 1 }
          }
        ];
        const domainData = MatchMapper.toDomainList(mockData);
        setData(domainData);
        setLoading(false);
        return;
      }

      const loadedData: MatchDto[] = await window.api.loadData();
      const domainData = MatchMapper.toDomainList(loadedData);
      setData(domainData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleToggleSignal = () => setSignalMode(prev => !prev);
  const handleToggleDensity = () => setDensity(prev => prev === 'compact' ? 'comfortable' : 'compact');

  const handleTeamSelect = (teamName: string) => {
    setSelectedTeam(teamName);
    setCurrentPage('team-profile');
  };

  const handleBackToMatches = () => {
    setCurrentPage('matches');
    setSelectedTeam('');
  };

  return (
    <AppLayout
      sidebar={
        <Sidebar
          currentPage={currentPage}
          onNavigate={(page) => setCurrentPage(page as Page)}
        />
      }
      topbar={
        <Topbar
          matchCount={data.length}
          signalMode={signalMode}
          onToggleSignal={handleToggleSignal}
          currentDensity={density}
          onToggleDensity={handleToggleDensity}
        />
      }
    >
      {currentPage === 'matches' && (
        <Matches
          data={data}
          loading={loading}
          onReload={loadData}
          onTeamSelect={handleTeamSelect}
          signalMode={signalMode}
          density={density}
        />
      )}
      {currentPage === 'dashboard' && <Dashboard data={data} />}
      {currentPage === 'crawler' && <CrawlerDashboard />}
      {currentPage === 'archive' && <ArchiveDashboard />}
      {currentPage === 'team-profile' && selectedTeam && (
        <TeamProfile
          teamName={selectedTeam}
          allMatches={data}
          onBack={handleBackToMatches}
        />
      )}
      {(currentPage === 'tools' || currentPage === 'settings' || currentPage === 'leagues' || currentPage === 'favorites' || currentPage === 'strategy' || currentPage === 'odds-flow') && (
        <div style={{ padding: '40px', textAlign: 'center', opacity: 0.5, color: NEON_THEME.colors.text.primary }}>
          {TEXTS.LAYOUT.WIP}
        </div>
      )}
    </AppLayout>
  );
}

export default App;
