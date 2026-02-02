export function getBackgroundStyle(backgroundColor?: string): { className: string; style?: React.CSSProperties } {
  if (!backgroundColor || backgroundColor === 'transparent') {
    return { className: 'bg-white' };
  }

  if (backgroundColor.startsWith('#') || backgroundColor.startsWith('rgb') || backgroundColor.startsWith('hsl')) {
    return {
      className: '',
      style: { backgroundColor }
    };
  }

  return { className: 'bg-white' };
}
