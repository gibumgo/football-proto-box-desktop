import React, { useState } from 'react';
import { COLORS, SPACING, TYPOGRAPHY, GLOW_EFFECTS } from '../../constants/designSystem';
import { TEXTS } from '../../constants/uiTexts';
import type { BetinfoOptions, FlashscoreOptions, MappingOptions } from '../../types/crawler';

interface CrawlerControlPanelProps {
    onStart: (options: BetinfoOptions | FlashscoreOptions | MappingOptions) => void;
    onStop: () => void;
    isRunning: boolean;
}

const CrawlerControlPanel: React.FC<CrawlerControlPanelProps> = ({ onStart, onStop, isRunning }) => {
    const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
    const [site, setSite] = useState<'betinfo' | 'flashscore' | 'mapping'>('betinfo');

    // Config States matching Python config.py defaults
    const [betinfoConfig, setBetinfoConfig] = useState<Partial<BetinfoOptions>>({
        collectionType: 'recent',
        recent: 5,
        startRound: '040',
        endRound: '050',
        rounds: '',
        year: new Date().getFullYear()
    });

    const [flashscoreConfig, setFlashscoreConfig] = useState<Partial<FlashscoreOptions>>({
        task: 'metadata',
        season: '2025-2026',
        url: '',
        resume: false
    });

    const [mappingConfig, setMappingConfig] = useState<Partial<MappingOptions>>({
        task: 'leagues'
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
                startRound: `${betinfoConfig.year}${String(betinfoConfig.startRound).padStart(3, '0')}`,
                endRound: `${betinfoConfig.year}${String(betinfoConfig.endRound).padStart(3, '0')}`,
                rounds: betinfoConfig.rounds,
                year: betinfoConfig.year
            });
        } else if (site === 'flashscore') {
            if (!flashscoreConfig.url) {
                alert(TEXTS.CRAWLER.CONTROL_PANEL.MSG_URL_REQUIRED);
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
        } else {
            onStart({
                mode: 'mapping',
                ...advancedConfig,
                task: mappingConfig.task as any
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
                    label={TEXTS.CRAWLER.SITE_BETINFO}
                    active={site === 'betinfo'}
                    onClick={() => setSite('betinfo')}
                    disabled={isRunning}
                />
                <SiteButton
                    label={TEXTS.CRAWLER.SITE_FLASHSCORE}
                    active={site === 'flashscore'}
                    onClick={() => setSite('flashscore')}
                    disabled={isRunning}
                />
                <SiteButton
                    label={TEXTS.CRAWLER.SITE_MAPPING}
                    active={site === 'mapping'}
                    onClick={() => setSite('mapping')}
                    disabled={isRunning}
                />
            </div>

            {/* Main Config Form */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.MD }}>
                {site === 'betinfo' && (
                    <BetinfoConfigForm
                        config={betinfoConfig}
                        onChange={setBetinfoConfig}
                        disabled={isRunning}
                    />
                )}
                {site === 'flashscore' && (
                    <FlashscoreConfigForm
                        config={flashscoreConfig}
                        onChange={setFlashscoreConfig}
                        disabled={isRunning}
                    />
                )}
                {site === 'mapping' && (
                    <MappingConfigForm
                        config={mappingConfig}
                        onChange={setMappingConfig}
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
                    <span>{TEXTS.CRAWLER.CONTROL_PANEL.ADVANCED_SETTINGS}</span>
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
                    {isRunning ? TEXTS.CRAWLER.CONTROL_PANEL.BTN_RUNNING : TEXTS.CRAWLER.CONTROL_PANEL.BTN_START}
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
                        {TEXTS.CRAWLER.CONTROL_PANEL.BTN_STOP}
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
        <FormField label={TEXTS.CRAWLER.CONTROL_PANEL.BETINFO.LABEL_YEAR}>
            <input
                type="number"
                value={config.year}
                onChange={(e) => onChange({ ...config, year: parseInt(e.target.value) })}
                disabled={disabled}
                style={{ ...inputStyle, maxWidth: '120px' }}
            />
        </FormField>

        <RadioGroup label={TEXTS.CRAWLER.CONTROL_PANEL.BETINFO.LABEL_COLLECTION_TYPE}>
            <RadioButton
                label={TEXTS.CRAWLER.CONTROL_PANEL.BETINFO.TYPE_RECENT}
                checked={config.collectionType === 'recent'}
                onClick={() => onChange({ ...config, collectionType: 'recent' })}
                disabled={disabled}
            />
            <RadioButton
                label={TEXTS.CRAWLER.CONTROL_PANEL.BETINFO.TYPE_RANGE}
                checked={config.collectionType === 'range'}
                onClick={() => onChange({ ...config, collectionType: 'range' })}
                disabled={disabled}
            />
        </RadioGroup>

        {config.collectionType === 'recent' ? (
            <FormField label={TEXTS.CRAWLER.CONTROL_PANEL.BETINFO.LABEL_RECENT_COUNT}>
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
                <FormField label={TEXTS.CRAWLER.CONTROL_PANEL.BETINFO.LABEL_START_ROUND}>
                    <input
                        type="text"
                        maxLength={3}
                        value={config.startRound}
                        onChange={(e) => onChange({ ...config, startRound: e.target.value.replace(/[^0-9]/g, '') })}
                        disabled={disabled}
                        style={inputStyle}
                        placeholder={TEXTS.CRAWLER.CONTROL_PANEL.BETINFO.PLACEHOLDER_START_ROUND}
                    />
                </FormField>
                <FormField label={TEXTS.CRAWLER.CONTROL_PANEL.BETINFO.LABEL_END_ROUND}>
                    <input
                        type="text"
                        maxLength={3}
                        value={config.endRound}
                        onChange={(e) => onChange({ ...config, endRound: e.target.value.replace(/[^0-9]/g, '') })}
                        disabled={disabled}
                        style={inputStyle}
                        placeholder={TEXTS.CRAWLER.CONTROL_PANEL.BETINFO.PLACEHOLDER_END_ROUND}
                    />
                </FormField>
            </div>
        )}


    </div>
);

const FlashscoreConfigForm = ({ config, onChange, disabled }: any) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.LG }}>
        <FormField label={TEXTS.CRAWLER.CONTROL_PANEL.FLASHSCORE.LABEL_TASK_TYPE}>
            <select
                value={config.task}
                onChange={(e) => onChange({ ...config, task: e.target.value })}
                disabled={disabled}
                style={inputStyle}
            >
                <option value="metadata">{TEXTS.CRAWLER.CONTROL_PANEL.FLASHSCORE.TYPE_METADATA}</option>
                <option value="matches">{TEXTS.CRAWLER.CONTROL_PANEL.FLASHSCORE.TYPE_MATCHES}</option>
            </select>
        </FormField>

        <FormField label={TEXTS.CRAWLER.CONTROL_PANEL.FLASHSCORE.LABEL_TARGET_URL}>
            <input
                type="text"
                value={config.url}
                onChange={(e) => {
                    const newUrl = e.target.value;
                    let updates: any = { url: newUrl };

                    // 자동 시즌 감지 로직 (Smart Season)
                    // 예: ...-2024-2025/... -> 24-25
                    const seasonMatch = newUrl.match(/-(\d{2})(\d{2})-(\d{2})(\d{2})\//);
                    if (seasonMatch) {
                        updates.season = `${seasonMatch[2]}-${seasonMatch[4]}`;
                    }

                    onChange({ ...config, ...updates });
                }}
                disabled={disabled}
                style={inputStyle}
                placeholder={TEXTS.CRAWLER.CONTROL_PANEL.FLASHSCORE.PLACEHOLDER_TARGET_URL}
            />
            <div style={{
                marginTop: '6px',
                fontSize: '11px',
                color: COLORS.TEXT_SECONDARY,
                lineHeight: '1.4',
                backgroundColor: 'rgba(0,0,0,0.2)',
                padding: '8px',
                borderRadius: '4px',
                borderLeft: `2px solid ${COLORS.NEON_BLUE}`
            }}>
                {config.task === 'metadata' ? (
                    <>
                        <strong style={{ color: COLORS.NEON_BLUE }}>{TEXTS.CRAWLER.CONTROL_PANEL.FLASHSCORE.GUIDE_METADATA_TITLE}</strong><br />
                        {TEXTS.CRAWLER.CONTROL_PANEL.FLASHSCORE.GUIDE_METADATA_DESC}<br />
                        {TEXTS.CRAWLER.CONTROL_PANEL.FLASHSCORE.GUIDE_METADATA_EX}
                    </>
                ) : (
                    <>
                        <strong style={{ color: COLORS.NEON_BLUE }}>{TEXTS.CRAWLER.CONTROL_PANEL.FLASHSCORE.GUIDE_MATCHES_TITLE}</strong><br />
                        {TEXTS.CRAWLER.CONTROL_PANEL.FLASHSCORE.GUIDE_MATCHES_DESC}<br />
                        {TEXTS.CRAWLER.CONTROL_PANEL.FLASHSCORE.GUIDE_MATCHES_EX}
                    </>
                )}
            </div>
        </FormField>

        {config.task === 'matches' ? (
            <div style={{ display: 'flex', gap: SPACING.SM }}>
                <FormField label={TEXTS.CRAWLER.CONTROL_PANEL.FLASHSCORE.LABEL_SEASON}>
                    <input
                        type="text"
                        value={config.season}
                        onChange={(e) => onChange({ ...config, season: e.target.value })}
                        disabled={disabled}
                        style={inputStyle}
                    />
                </FormField>
                <FormField label={TEXTS.CRAWLER.CONTROL_PANEL.FLASHSCORE.LABEL_START_ROUND}>
                    <input
                        type="number"
                        min="1"
                        max="38"
                        value={config.fsStartRound || ''}
                        onChange={(e) => onChange({ ...config, fsStartRound: parseInt(e.target.value) })}
                        disabled={disabled}
                        style={inputStyle}
                        placeholder={TEXTS.CRAWLER.CONTROL_PANEL.FLASHSCORE.PLACEHOLDER_START_ROUND}
                    />
                </FormField>
                <FormField label={TEXTS.CRAWLER.CONTROL_PANEL.FLASHSCORE.LABEL_END_ROUND}>
                    <input
                        type="number"
                        min="1"
                        max="38"
                        value={config.fsEndRound || ''}
                        onChange={(e) => onChange({ ...config, fsEndRound: parseInt(e.target.value) })}
                        disabled={disabled}
                        style={inputStyle}
                        placeholder={TEXTS.CRAWLER.CONTROL_PANEL.FLASHSCORE.PLACEHOLDER_END_ROUND}
                    />
                </FormField>
            </div>
        ) : (
            <FormField label={TEXTS.CRAWLER.CONTROL_PANEL.FLASHSCORE.LABEL_SEASON}>
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
            label={TEXTS.CRAWLER.CONTROL_PANEL.FLASHSCORE.CHECKBOX_RESUME}
            checked={config.resume}
            onChange={(checked: boolean) => onChange({ ...config, resume: checked })}
            disabled={disabled}
        />
    </div>
);

const AdvancedConfigForm = ({ config, onChange, disabled }: any) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.MD }}>
        <Checkbox
            label={TEXTS.CRAWLER.CONTROL_PANEL.ADVANCED.CHECKBOX_HEADLESS}
            checked={config.headless}
            onChange={(checked: boolean) => onChange({ ...config, headless: checked })}
            disabled={disabled}
        />

        <Checkbox
            label={TEXTS.CRAWLER.CONTROL_PANEL.ADVANCED.CHECKBOX_DEBUG}
            checked={config.debug}
            onChange={(checked: boolean) => onChange({ ...config, debug: checked })}
            disabled={disabled}
        />

        <FormField label={TEXTS.CRAWLER.CONTROL_PANEL.ADVANCED.LABEL_TIMEOUT}>
            <input
                type="number"
                value={config.timeout}
                onChange={(e) => onChange({ ...config, timeout: parseInt(e.target.value) })}
                disabled={disabled}
                style={{ ...inputStyle, maxWidth: '100px' }}
            />
        </FormField>

        <FormField label={TEXTS.CRAWLER.CONTROL_PANEL.ADVANCED.LABEL_OUTPUT_DIR}>
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

const MappingConfigForm = ({ config, onChange, disabled }: any) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.LG }}>
        <RadioGroup label={TEXTS.CRAWLER.CONTROL_PANEL.MAPPING.LABEL_DESCRIPTION}>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                padding: '12px',
                backgroundColor: 'rgba(0,0,0,0.2)',
                borderRadius: '6px',
                borderLeft: `2px solid ${COLORS.NEON_CYAN}`,
                fontSize: '12px',
                color: COLORS.TEXT_SECONDARY
            }}>
                {config.task === 'leagues' ? (
                    <span>{TEXTS.CRAWLER.CONTROL_PANEL.MAPPING.DESC_MAP_LEAGUES}</span>
                ) : (
                    <span>{TEXTS.CRAWLER.CONTROL_PANEL.MAPPING.DESC_MAP_TEAMS}</span>
                )}
            </div>
        </RadioGroup>

        <RadioGroup label="Mapping Task">
            <div style={{ display: 'flex', gap: SPACING.LG }}>
                <RadioButton
                    label={TEXTS.CRAWLER.CONTROL_PANEL.MAPPING.BTN_MAP_LEAGUES}
                    checked={config.task === 'leagues'}
                    onClick={() => onChange({ ...config, task: 'leagues' })}
                    disabled={disabled}
                />
                <RadioButton
                    label={TEXTS.CRAWLER.CONTROL_PANEL.MAPPING.BTN_MAP_TEAMS}
                    checked={config.task === 'teams'}
                    onClick={() => onChange({ ...config, task: 'teams' })}
                    disabled={disabled}
                />
            </div>
        </RadioGroup>
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
