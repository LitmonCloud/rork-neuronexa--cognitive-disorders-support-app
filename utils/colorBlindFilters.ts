import { ColorBlindMode } from '@/types/task';

export function applyColorBlindFilter(color: string, mode: ColorBlindMode): string {
  if (mode === 'none') return color;

  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  let newR = r;
  let newG = g;
  let newB = b;

  switch (mode) {
    case 'protanopia':
      newR = 0.567 * r + 0.433 * g;
      newG = 0.558 * r + 0.442 * g;
      newB = 0.242 * g + 0.758 * b;
      break;
    case 'deuteranopia':
      newR = 0.625 * r + 0.375 * g;
      newG = 0.7 * r + 0.3 * g;
      newB = 0.3 * g + 0.7 * b;
      break;
    case 'tritanopia':
      newR = 0.95 * r + 0.05 * g;
      newG = 0.433 * r + 0.567 * g;
      newB = 0.475 * g + 0.525 * b;
      break;
  }

  const toHex = (val: number) => {
    const hex = Math.round(Math.max(0, Math.min(255, val * 255))).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(newR)}${toHex(newG)}${toHex(newB)}`;
}

export function getAccessibleColorPair(
  foreground: string,
  background: string,
  mode: ColorBlindMode
): { foreground: string; background: string } {
  const fg = applyColorBlindFilter(foreground, mode);
  const bg = applyColorBlindFilter(background, mode);

  const contrast = getContrastRatio(fg, bg);
  
  if (contrast < 4.5) {
    return {
      foreground: '#000000',
      background: '#FFFFFF',
    };
  }

  return { foreground: fg, background: bg };
}

function getContrastRatio(color1: string, color2: string): number {
  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

function getLuminance(color: string): number {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  const [rs, gs, bs] = [r, g, b].map((c) => {
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}
