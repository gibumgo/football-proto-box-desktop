import React, { useState } from 'react';
import { COLORS, SPACING, TYPOGRAPHY, GLOW_EFFECTS } from '../../constants/designSystem';
import type { BetinfoOptions, FlashscoreOptions } from '../../types/crawler';

interface CrawlerControlPanelProps {
    onStart: (options: BetinfoOptions | FlashscoreOptions) => void;
    onStop: () => void;
    isRunning: boolean;
}

const CrawlerControlPanel: React.FC<CrawlerControlPanelProps> = ({ onStart, onStop, isRunning }) => {
    const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
    const [site, setSite] = useState<'betinfo' | 'flashscore'>('betinfo');

    // Config States matching Python config.py defaults
    const [betinfoConfig, setBetinfoConfig] = useState<Partial<BetinfoOptions>>({
        collectionType: 'recent',
        recent: 5,
        startRound: '2025040',
        endRound: '2025050',
        rounds: '',
        year: new Date().getFullYear()
    });

    const [flashscoreConfig, setFlashscoreConfig] = useState<Partial<FlashscoreOptions>>({
        task: 'metadata',
        season: '2025-2026',
        url: '',
        resume: false
    });

    const [advancedConfig, setAdvancedConfig] = useState({
        headless: true,
        debug: false,
        timeout: 300,
        outputDir: './data'
    });

    const handleStart = () => {
        if (site === 'betinfo') {
            onStart({
                mode: 'betinfo',
                ...advancedConfig,
                collectionType: betinfoConfig.collectionType as any,
                recent: betinfoConfig.recent,
                startRound: betinfoConfig.startRound,
                endRound: betinfoConfig.endRound,
                rounds: betinfoConfig.rounds,
                year: betinfoConfig.year
            });
        } else {
            if (!flashscoreConfig.url) {
                alert('URL을 입력해주세요.');
                return;
            }
            onStart({
                mode: 'flashscore',
                ...advancedConfig,
                task: flashscoreConfig.task as any,
                season: flashscoreConfig.season,
                url: flashscoreConfig.url!,
                resume: flashscoreConfig.resume
            });
        }
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            gap: SPACING.LG
        }}>
            {/* Site Selector - Integrated Look */}
            <div style={{
                display: 'flex',
                backgroundColor: COLORS.APP_BG,
                padding: '4px',
                borderRadius: '6px',
                border: `1px solid ${COLORS.BORDER}`
            }}>
                <SiteButton
                    label="Betinfo"
                    active={site === 'betinfo'}
                    onClick={() => setSite('betinfo')}
                    disabled={isRunning}
                />
                <SiteButton
                    label="Flashscore"
                    active={site === 'flashscore'}
                    onClick={() => setSite('flashscore')}
                    disabled={isRunning}
                />
            </div>

            {/* Main Config Form */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.MD }}>
                {site === 'betinfo' ? (
                    <BetinfoConfigForm
                        config={betinfoConfig}
                        onChange={setBetinfoConfig}
                        disabled={isRunning}
                    />
                ) : (
                    <FlashscoreConfigForm
                        config={flashscoreConfig}
                        onChange={setFlashscoreConfig}
                        disabled={isRunning}
                    />
                )}
            </div>

            {/* Advanced Settings Accordion */}
            <div style={{ borderTop: `1px solid ${COLORS.BORDER}`, paddingTop: SPACING.SM }}>
                <button
                    onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
                    style={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        background: 'none',
                        border: 'none',
                        color: COLORS.TEXT_SECONDARY,
                        cursor: 'pointer',
                        padding: `${SPACING.XS} 0`,
                        fontSize: TYPOGRAPHY.FONT_SIZE.SM,
                        fontWeight: TYPOGRAPHY.FONT_WEIGHT.MEDIUM
                    }}
                >
                    <span>고급 설정</span>
                    <span style={{ fontSize: '10px', transform: isAdvancedOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>▼</span>
                </button>

                {isAdvancedOpen && (
                    <div style={{ marginTop: SPACING.MD, animation: 'fadeIn 0.2s ease' }}>
                        <AdvancedConfigForm
                            config={advancedConfig}
                            onChange={setAdvancedConfig}
                            disabled={isRunning}
                        />
                    </div>
                )}
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: SPACING.SM, marginTop: SPACING.XS }}>
                <button
                    onClick={handleStart}
                    disabled={isRunning}
                    style={{
                        flex: 1,
                        height: '40px',
                        backgroundColor: isRunning ? COLORS.SURFACE : COLORS.NEON_BLUE,
                        color: isRunning ? COLORS.TEXT_MUTED : '#000',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: TYPOGRAPHY.FONT_SIZE.SM,
                        fontWeight: TYPOGRAPHY.FONT_WEIGHT.BOLD,
                        cursor: isRunning ? 'not-allowed' : 'pointer',
                        transition: 'all 0.2s',
                        boxShadow: isRunning ? 'none' : GLOW_EFFECTS.NEON_BLUE
                    }}
                >
                    {isRunning ? '실행 중...' : '크롤링 시작'}
                </button>

                {isRunning && (
                    <button
                        onClick={onStop}
                        style={{
                            padding: `0 ${SPACING.LG}`,
                            height: '40px',
                            backgroundColor: COLORS.NEON_RED,
                            color: '#FFF',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: TYPOGRAPHY.FONT_SIZE.SM,
                            fontWeight: TYPOGRAPHY.FONT_WEIGHT.BOLD,
                            cursor: 'pointer',
                            opacity: 0.9
                        }}
                    >
                        중지
                    </button>
                )}
            </div>
        </div>
    );
};

// Sub Components
const SiteButton = ({ label, active, onClick, disabled }: any) => (
    <button
        onClick={onClick}
        disabled={disabled}
        style={{
            flex: 1,
            padding: '8px',
            backgroundColor: active ? COLORS.NEON_BLUE : 'transparent',
            color: active ? '#000' : COLORS.TEXT_SECONDARY,
            border: 'none',
            borderRadius: '4px',
            fontSize: TYPOGRAPHY.FONT_SIZE.SM,
            fontWeight: active ? TYPOGRAPHY.FONT_WEIGHT.BOLD : TYPOGRAPHY.FONT_WEIGHT.NORMAL,
            cursor: disabled ? 'not-allowed' : 'pointer',
            opacity: disabled ? 0.7 : 1,
            transition: 'all 0.2s'
        }}
    >
        {label}
    </button>
);

const BetinfoConfigForm = ({ config, onChange, disabled }: any) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.LG }}>
        <RadioGroup label="수집 범위">
            <RadioButton
                label="최신 회차"
                checked={config.collectionType === 'recent'}
                onClick={() => onChange({ ...config, collectionType: 'recent' })}
                disabled={disabled}
            />
            <RadioButton
                label="구간 지정"
                checked={config.collectionType === 'range'}
                onClick={() => onChange({ ...config, collectionType: 'range' })}
                disabled={disabled}
            />
        </RadioGroup>

        {config.collectionType === 'recent' ? (
            <FormField label="수집할 회차 수">
                <input
                    type="number"
                    value={config.recent}
                    onChange={(e) => onChange({ ...config, recent: parseInt(e.target.value) })}
                    disabled={disabled}
                    style={{ ...inputStyle, maxWidth: '120px' }}
                />
            </FormField>
        ) : (
            <div style={{ display: 'flex', gap: SPACING.SM }}>
                <FormField label="시작 (YYYYRRR)">
                    <input
                        type="text"
                        value={config.startRound}
                        onChange={(e) => onChange({ ...config, startRound: e.target.value })}
                        disabled={disabled}
                        style={inputStyle}
                        placeholder="2025040"
                    />
                </FormField>
                <FormField label="종료 (YYYYRRR)">
                    <input
                        type="text"
                        value={config.endRound}
                        onChange={(e) => onChange({ ...config, endRound: e.target.value })}
                        disabled={disabled}
                        style={inputStyle}
                        placeholder="2025050"
                    />
                </FormField>
            </div>
        )}

        <FormField label="대상 연도">
            <input
                type="number"
                value={config.year}
                onChange={(e) => onChange({ ...config, year: parseInt(e.target.value) })}
                disabled={disabled}
                style={{ ...inputStyle, maxWidth: '120px' }}
            />
        </FormField>
    </div>
);

const FlashscoreConfigForm = ({ config, onChange, disabled }: any) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.LG }}>
        <FormField label="작업 유형">
            <select
                value={config.task}
                onChange={(e) => onChange({ ...config, task: e.target.value })}
                disabled={disabled}
                style={inputStyle}
            >
                <option value="metadata">메타데이터 (순위/팀)</option>
                <option value="matches">경기 결과</option>
            </select>
        </FormField>

        <FormField label="타겟 URL (Flashscore.co.kr)">
            <input
                type="text"
                value={config.url}
                onChange={(e) => onChange({ ...config, url: e.target.value })}
                disabled={disabled}
                style={inputStyle}
                placeholder="https://www.flashscore.co.kr/..."
            />
            <div style={{
                marginTop: '6px',
                fontSize: '11px',
                color: COLORS.TEXT_SECONDARY,
                lineHeight: '1.4',
                backgroundColor: 'rgba(0,0,0,0.2)',
                padding: '6px',
                borderRadius: '4px'
            }}>
                {config.task === 'metadata' ? (
                    <>예시: https://www.flashscore.co.kr/soccer/england/premier-league/standings/#/OEEq9Yvp/standings/overall/</>
                ) : (
                    <>예시: https://www.flashscore.co.kr/soccer/england/premier-league/results/</>
                )}
            </div>
        </FormField>

        {config.task === 'matches' && (
            <FormField label="시즌 (예: 2025-2026)">
                <input
                    type="text"
                    value={config.season}
                    onChange={(e) => onChange({ ...config, season: e.target.value })}
                    disabled={disabled}
                    style={inputStyle}
                />
            </FormField>
        )}

        <Checkbox
            label="중단된 지점부터 이어하기 (Resume)"
            checked={config.resume}
            onChange={(checked: boolean) => onChange({ ...config, resume: checked })}
            disabled={disabled}
        />
    </div>
);

const AdvancedConfigForm = ({ config, onChange, disabled }: any) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.MD }}>
        <Checkbox
            label="헤드리스 모드 (브라우저 숨김)"
            checked={config.headless}
            onChange={(checked: boolean) => onChange({ ...config, headless: checked })}
            disabled={disabled}
        />

        <Checkbox
            label="디버그 로그 출력"
            checked={config.debug}
            onChange={(checked: boolean) => onChange({ ...config, debug: checked })}
            disabled={disabled}
        />

        <FormField label="타임아웃 (초)">
            <input
                type="number"
                value={config.timeout}
                onChange={(e) => onChange({ ...config, timeout: parseInt(e.target.value) })}
                disabled={disabled}
                style={{ ...inputStyle, maxWidth: '100px' }}
            />
        </FormField>

        <FormField label="데이터 저장 경로">
            <input
                type="text"
                value={config.outputDir}
                onChange={(e) => onChange({ ...config, outputDir: e.target.value })}
                disabled={disabled}
                style={inputStyle}
            />
        </FormField>
    </div>
);

const FormField = ({ label, children }: any) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
        <label style={{
            fontSize: TYPOGRAPHY.FONT_SIZE.SM,
            color: COLORS.TEXT_SECONDARY,
            fontWeight: TYPOGRAPHY.FONT_WEIGHT.MEDIUM
        }}>
            {label}
        </label>
        {children}
    </div>
);

const RadioGroup = ({ label, children }: any) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label style={{ fontSize: TYPOGRAPHY.FONT_SIZE.SM, color: COLORS.TEXT_SECONDARY }}>{label}</label>
        <div style={{ display: 'flex', gap: SPACING.LG }}>{children}</div>
    </div>
);

const RadioButton = ({ label, checked, onClick, disabled }: any) => (
    <label style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        color: checked ? COLORS.NEON_BLUE : COLORS.TEXT_PRIMARY,
        fontSize: TYPOGRAPHY.FONT_SIZE.SM,
        userSelect: 'none'
    }}>
        <div
            onClick={!disabled ? onClick : undefined}
            style={{
                width: '14px',
                height: '14px',
                borderRadius: '50%',
                border: `1px solid ${checked ? COLORS.NEON_BLUE : COLORS.TEXT_SECONDARY}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
            {checked && <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: COLORS.NEON_BLUE }} />}
        </div>
        <span onClick={!disabled ? onClick : undefined}>{label}</span>
    </label>
);

const Checkbox = ({ label, checked, onChange, disabled }: any) => (
    <label style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        color: COLORS.TEXT_PRIMARY,
        fontSize: TYPOGRAPHY.FONT_SIZE.SM,
        userSelect: 'none'
    }}>
        <div
            onClick={() => !disabled && onChange(!checked)}
            style={{
                width: '16px',
                height: '16px',
                borderRadius: '3px',
                border: `1px solid ${checked ? COLORS.NEON_BLUE : COLORS.TEXT_SECONDARY}`,
                backgroundColor: checked ? 'rgba(0, 255, 255, 0.1)' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: COLORS.NEON_BLUE,
                fontSize: '12px',
                fontWeight: 'bold'
            }}>
            {checked && '✓'}
        </div>
        <span onClick={() => !disabled && onChange(!checked)}>{label}</span>
    </label>
);

const inputStyle: React.CSSProperties = {
    padding: '8px 12px',
    backgroundColor: COLORS.APP_BG,
    border: `1px solid ${COLORS.BORDER}`,
    borderRadius: '4px',
    color: COLORS.TEXT_PRIMARY,
    fontSize: TYPOGRAPHY.FONT_SIZE.SM,
    fontFamily: TYPOGRAPHY.FONT_FAMILY.MONO,
    outline: 'none',
    width: '100%',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box'
};

export default CrawlerControlPanel;
