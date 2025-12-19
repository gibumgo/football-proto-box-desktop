import { useState, useMemo } from 'react';
import { Match } from '../domain/models/match/Match';
import { TeamStatsService } from '../domain/services/TeamStatsService';
import { MatchTypeHelper, MatchTypeConstants } from '../utils/matchTypeHelper';
import { MatchTeamFilter } from '../domain/operations/filter/MatchTeamFilter';
import { MatchOddsFilter } from '../domain/operations/filter/MatchOddsFilter';
import { MatchLocationFilter } from '../domain/operations/filter/MatchLocationFilter';
import { MatchSorter } from '../domain/operations/sort/MatchSorter';

export interface UseTeamProfileResult {
    // Data
    stats: any; // TeamStats type
    availableOdds: number[];
    paginatedMatches: Match[];
    filteredMatchesLength: number;
    totalPages: number;
    teamMatches: Match[]; // 전체 경기 (필터링 전)

    // State
    location: 'all' | 'home' | 'away';
    selectedOdds: number[];
    selectedMatchTypes: string[];
    sortBy: 'date' | 'odds' | 'round';
    sortOrder: 'asc' | 'desc';
    currentPage: number;

    // Handlers
    setLocation: (loc: 'all' | 'home' | 'away') => void;
    setSelectedOdds: (odds: number[]) => void;
    setSelectedMatchTypes: (types: string[]) => void;
    setSortBy: (sort: 'date' | 'odds' | 'round') => void;
    setSortOrder: (order: 'asc' | 'desc') => void;
    setCurrentPage: (page: number) => void;

    // Convenience Handlers (Composite actions)
    handleFilterChange: (loc: 'all' | 'home' | 'away') => void;
    handleOddsChange: (odds: number[]) => void;
    handleTypeChange: (types: string[]) => void;
    handleSort: (newSortBy: 'date' | 'odds' | 'round') => void;
}

/**
 * TeamProfile 페이지의 비즈니스 로직과 상태 관리를 분리한 커스텀 훅
 * 책임:
 * - 상태 관리 (필터, 정렬, 페이징)
 * - 도메인 로직 호출 (TeamStatsService 및 Filters)
 * - 데이터 가공
 */
export function useTeamProfile(teamName: string, allMatches: Match[]): UseTeamProfileResult {
    // 1. 단순 상태 정의
    const [location, setLocation] = useState<'all' | 'home' | 'away'>('all');
    const [selectedOdds, setSelectedOdds] = useState<number[]>([]);
    const [selectedMatchTypes, setSelectedMatchTypes] = useState<string[]>(['GENERAL', 'HANDICAP', 'UNDER_OVER']);
    const [sortBy, setSortBy] = useState<'date' | 'odds' | 'round'>('date');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // 2. 데이터 가공 (Memoization)

    // 팀 경기 필터링
    const teamMatches = useMemo(() =>
        MatchTeamFilter.byTeamUnique(allMatches, teamName),
        [allMatches, teamName]
    );

    // 통계 계산
    const stats = useMemo(() =>
        TeamStatsService.calculate(teamMatches, teamName),
        [teamMatches, teamName]
    );

    // 배당 목록 추출
    const availableOdds = useMemo(() =>
        MatchOddsFilter.extractUniqueOdds(teamMatches),
        [teamMatches]
    );

    // 필터링 및 정렬 로직 적용
    const filteredMatches = useMemo(() => {
        let result = MatchLocationFilter.byLocation(teamMatches, teamName, location);

        // SUM 제외
        result = result.filter(match => {
            const type = match.info.type?.toUpperCase();
            return type !== 'SUM' && type !== '합';
        });

        // 경기 종류 필터
        if (selectedMatchTypes.length > 0) {
            result = result.filter(match => {
                const { mainType } = MatchTypeHelper.parseMatchType(match.info.type);
                let typeKey = '';
                if (mainType === MatchTypeConstants.TEXT.GENERAL) typeKey = 'GENERAL';
                else if (mainType === MatchTypeConstants.TEXT.HANDICAP) typeKey = 'HANDICAP';
                else if (mainType === MatchTypeConstants.TEXT.UNDER_OVER) typeKey = 'UNDER_OVER';

                return selectedMatchTypes.includes(typeKey);
            });
        }

        // 배당 필터
        if (selectedOdds.length > 0) {
            result = MatchOddsFilter.byOdds(result, selectedOdds);
        }

        // 정렬
        result = MatchSorter.sort(result, sortBy, sortOrder, teamName);

        return result;
    }, [teamMatches, teamName, location, selectedOdds, selectedMatchTypes, sortBy, sortOrder]);

    // 페이징 계산
    const totalPages = Math.ceil(filteredMatches.length / itemsPerPage);
    const paginatedMatches = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredMatches.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredMatches, currentPage, itemsPerPage]);

    // 3. 복합 핸들러 (State Change + Side Effects like resetting page)
    const handleFilterChange = (newLocation: 'all' | 'home' | 'away') => {
        setLocation(newLocation);
        setCurrentPage(1);
    };

    const handleOddsChange = (odds: number[]) => {
        setSelectedOdds(odds);
        setCurrentPage(1);
    };

    const handleTypeChange = (types: string[]) => {
        setSelectedMatchTypes(types);
        setCurrentPage(1);
    };

    const handleSort = (newSortBy: 'date' | 'odds' | 'round') => {
        if (sortBy === newSortBy) {
            setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(newSortBy);
            setSortOrder('desc');
        }
        setCurrentPage(1);
    };

    return {
        // Data
        stats,
        availableOdds,
        paginatedMatches,
        filteredMatchesLength: filteredMatches.length, // Total count after filter
        totalPages,
        teamMatches,

        // State
        location,
        selectedOdds,
        selectedMatchTypes,
        sortBy,
        sortOrder,
        currentPage,

        // Basic Setters
        setLocation,
        setSelectedOdds,
        setSelectedMatchTypes,
        setSortBy,
        setSortOrder,
        setCurrentPage,

        // Enhancers
        handleFilterChange,
        handleOddsChange,
        handleTypeChange,
        handleSort
    };
}
