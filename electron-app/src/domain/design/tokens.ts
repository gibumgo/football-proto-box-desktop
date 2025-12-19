/**
 * 재사용 가능한 디자인 토큰
 * UI 컴포넌트에서 일관된 스타일을 적용하기 위한 상수 모음
 */

export const SPACING = {
    XS: '4px',
    SM: '8px',
    MD: '12px',
    LG: '16px',
    XL: '20px',
    XXL: '24px',
    XXXL: '32px',
};

export const BORDER_RADIUS = {
    SM: '4px',
    MD: '6px',
    LG: '8px',
    XL: '12px',
    ROUND: '50%',
};

export const SHADOW = {
    NONE: 'none',
    SM: '0 1px 2px rgba(0, 0, 0, 0.05)',
    MD: '0 2px 8px rgba(0, 0, 0, 0.1)',
    LG: '0 4px 16px rgba(0, 0, 0, 0.15)',
    GLOW: '0 0 8px rgba(59, 130, 246, 0.5)',
};

export const TRANSITION = {
    FAST: '0.15s ease',
    NORMAL: '0.2s ease',
    SLOW: '0.3s ease',
};

export const Z_INDEX = {
    BASE: 1,
    DROPDOWN: 10,
    STICKY: 50,
    SIDEBAR: 90,
    TOPBAR: 100,
    MODAL: 1000,
    TOOLTIP: 1100,
};

/**
 * 공통 버튼 스타일
 */
export const BUTTON_STYLES = {
    PRIMARY: {
        backgroundColor: '#3b82f6',
        color: '#ffffff',
        border: 'none',
        padding: '10px 20px',
        borderRadius: BORDER_RADIUS.MD,
        cursor: 'pointer',
        fontWeight: 600,
        transition: TRANSITION.NORMAL,
    },
    SECONDARY: {
        backgroundColor: 'transparent',
        color: '#94a3b8',
        border: '1px solid #334155',
        padding: '10px 20px',
        borderRadius: BORDER_RADIUS.MD,
        cursor: 'pointer',
        fontWeight: 500,
        transition: TRANSITION.NORMAL,
    },
    GHOST: {
        backgroundColor: 'transparent',
        color: '#e5e7eb',
        border: 'none',
        padding: '8px 12px',
        borderRadius: BORDER_RADIUS.SM,
        cursor: 'pointer',
        transition: TRANSITION.FAST,
    }
};

/**
 * 공통 인풋 스타일
 */
export const INPUT_STYLES = {
    BASE: {
        backgroundColor: '#0b1020',
        border: '1px solid #1e293b',
        borderRadius: BORDER_RADIUS.MD,
        padding: '8px 12px',
        color: '#e5e7eb',
        fontSize: '14px',
        outline: 'none',
        transition: TRANSITION.NORMAL,
    }
};
