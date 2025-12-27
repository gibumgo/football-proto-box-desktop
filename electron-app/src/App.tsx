import { useState, useEffect, useCallback } from 'react';
import { Matches } from './pages/Matches';
import { Dashboard } from './pages/Dashboard';
import { CrawlerDashboard } from './pages/CrawlerDashboard';
import { TeamProfile } from './pages/TeamProfile';
import { Match } from './domain/models/match/Match';
import { MatchMapper } from './domain/mappers/MatchMapper';
import type { MatchDto } from './types';
import { COLORS } from './domain/design/theme';
import { TEXTS } from './constants/uiTexts';
import './App.css';

// Layout Components
import { AppLayout } from './components/layout/AppLayout';
import { Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';

type Page = 'dashboard' | 'matches' | 'crawler' | 'team-profile' | 'tools' | 'settings';

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
      // 브라우저 환경에서는 목 데이터 사용
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
          },
          {
            round: 1234,
            matchNo: 2,
            dateTime: '2025-12-17T18:00:00',
            league: 'LaLiga',
            home: '레알 마드리드',
            away: 'FC 바르셀로나',
            type: 'GENERAL',
            winOdd: 1.85,
            drawOdd: 3.40,
            loseOdd: 4.20,
            result: '무',
            resultOdd: 3.40,
            score: { home: 1, away: 1 }
          },
          {
            round: 1234,
            matchNo: 3,
            dateTime: '2025-12-17T20:00:00',
            league: 'Bundesliga',
            home: '바이에른 뮌헨',
            away: '도르트문트',
            type: 'GENERAL',
            winOdd: 1.50,
            drawOdd: 4.00,
            loseOdd: 6.50,
            result: '패',
            resultOdd: 6.50,
            score: { home: 0, away: 2 }
          }
        ];
        const domainData = MatchMapper.toDomainList(mockData);
        setData(domainData);
        setLoading(false);
        return;
      }

      const loadedData: MatchDto[] = await window.api.loadData();
      console.log('Loaded data:', loadedData);
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

  // Handlers
  const handleToggleSignal = () => setSignalMode(prev => !prev);
  const handleToggleDensity = () => setDensity(prev => prev === 'compact' ? 'comfortable' : 'compact');
  const handleTeamSelect = (teamName: string) => {
    console.log('[App] handleTeamSelect called with:', teamName);
    // window.alert(`[App] Selecting team: ${teamName}`); // Debug
    setSelectedTeam(teamName);
    setCurrentPage('team-profile');
  };
  const handleBackToMatches = () => {
    setCurrentPage('matches');
    setSelectedTeam('');
  };

  // 디버깅
  console.log('현재 페이지:', currentPage, '데이터 개수:', data.length);

  return (
    <AppLayout
      sidebar={
        <Sidebar
          currentPage={currentPage}
          onNavigate={(page) => {
            console.log('페이지 이동:', page);
            setCurrentPage(page as Page);
          }}
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
          // Pass global UI state props
          signalMode={signalMode}
          density={density}
        />
      )}
      {currentPage === 'dashboard' && (
        <Dashboard data={data} />
      )}
      {currentPage === 'crawler' && (
        <CrawlerDashboard />
      )}
      {currentPage === 'team-profile' && selectedTeam && (
        <TeamProfile
          teamName={selectedTeam}
          allMatches={data}
          onBack={handleBackToMatches}
        />
      )}
      {(currentPage === 'tools' || currentPage === 'settings') && (
        <div style={{ padding: '40px', textAlign: 'center', opacity: 0.5, color: COLORS.TEXT_PRIMARY }}>
          {TEXTS.LAYOUT.WIP}
        </div>
      )}
    </AppLayout>
  );
}

export default App;
