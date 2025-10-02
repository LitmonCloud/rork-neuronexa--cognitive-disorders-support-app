import colors from '@/constants/colors';
import spacing, { borderRadius, iconSizes } from './spacing';
import typography, { fontSizes, fontWeights, lineHeights, letterSpacing } from './typography';

export const theme = {
  colors,
  spacing,
  borderRadius,
  iconSizes,
  typography,
  fontSizes,
  fontWeights,
  lineHeights,
  letterSpacing,
} as const;

export type Theme = typeof theme;

export default theme;
