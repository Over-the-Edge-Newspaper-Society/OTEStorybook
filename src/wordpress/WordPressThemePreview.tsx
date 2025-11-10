import { useMemo } from 'react';
import { buildWordPressPageHtml, type WordPressThemeMode } from './wordpressPage';

export interface WordPressThemePreviewProps {
  theme?: WordPressThemeMode;
  minHeight?: number;
  title?: string;
  buildHtml?: (theme: WordPressThemeMode) => string;
}

export function WordPressThemePreview({
  theme = 'light',
  minHeight = 1400,
  title = 'WordPress Theme Preview',
  buildHtml,
}: WordPressThemePreviewProps) {
  const docBuilder = buildHtml ?? buildWordPressPageHtml;
  const srcDoc = useMemo(() => docBuilder(theme), [docBuilder, theme]);

  return (
    <iframe
      key={theme}
      title={`${title} (${theme})`}
      srcDoc={srcDoc}
      style={{
        width: '100%',
        minHeight,
        border: '1px solid var(--border, #e2e8f0)',
        borderRadius: '24px',
        boxShadow: 'var(--shadow-lg, 0 10px 40px rgba(15, 23, 42, 0.12))',
        background: 'white',
      }}
    />
  );
}
