// Common color values
export const COLORS = {
  primary: '#0a84ff',
  primaryHover: '#0070d1',
  secondary: '#1c1c1e',
  background: {
    dark: '#000000',
    paper: 'rgba(28,28,30,0.8)',
    glass: 'rgba(44,44,46,0.8)',
    elevated: 'rgba(28,28,30,0.9)',
  },
  text: {
    primary: '#ffffff',
    secondary: '#8e8e93',
  },
  border: 'rgba(255,255,255,0.1)',
  borderHover: 'rgba(255,255,255,0.2)',
  borderFocus: 'rgba(255,255,255,0.3)',
  divider: 'rgba(255,255,255,0.1)',
  overlay: 'rgba(0,0,0,0.4)',
  overlayHover: 'rgba(0,0,0,0.5)',
  overlayElevated: 'rgba(0,0,0,0.6)',
} as const;

// Common border radius values
export const BORDER_RADIUS = {
  small: 2,
  medium: 3,
  large: 4,
  xlarge: 5,
  round: 999,
} as const;

// Common shadow values
export const SHADOWS = {
  small: '0 2px 8px 0 rgba(0,0,0,0.3)',
  medium: '0 4px 24px 0 rgba(0,0,0,0.4)',
  large: '0 8px 32px 0 rgba(0,0,0,0.5)',
  xlarge: '0 12px 40px 0 rgba(0,0,0,0.6)',
  primary: '0 2px 8px 0 rgba(10,132,255,0.3)',
} as const;

// Common spacing values
export const SPACING = {
  xs: 1,
  sm: 2,
  md: 3,
  lg: 4,
  xl: 5,
} as const;

// Common transition values
export const TRANSITIONS = {
  fast: '0.2s',
  medium: '0.3s',
  slow: '0.4s',
} as const;

// Common backdrop filter values
export const BACKDROP_FILTERS = {
  light: 'blur(8px)',
  medium: 'blur(12px)',
  heavy: 'blur(16px)',
  xheavy: 'blur(20px)',
  xxheavy: 'blur(24px)',
} as const; 