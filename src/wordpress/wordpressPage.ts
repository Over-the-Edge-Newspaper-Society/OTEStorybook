import baseTokens from './styles/index.css?raw';
import designSystem from './styles/design-system.css?raw';
import buttonAnimations from './styles/button-animations.css?raw';
import cardGrid from './styles/card-grid.css?raw';
import chipsTabs from './styles/chips-tabs.css?raw';
import organizationGrid from './styles/organization-grid.css?raw';
import newsGrid from './styles/news-grid.css?raw';
import staffProfiles from './styles/staff-profiles.css?raw';
import searchStyles from './styles/search.css?raw';
import eventsList from './styles/events-list.css?raw';
import appBarNav from './styles/app-bar-nav.css?raw';

import { storybookSupportStyles } from './supportStyles';
import { renderAppBar } from './sections/appBar';
import { renderContentSections } from './sections/contentSections';
import { renderMobileMenu } from './sections/mobileMenu';
import { renderSearchSheet } from './sections/search';
import { runtimeScript } from './runtimeScript';

export type WordPressThemeMode = 'light' | 'dark';

const combinedStyles = [
  designSystem,
  baseTokens,
  buttonAnimations,
  cardGrid,
  chipsTabs,
  organizationGrid,
  newsGrid,
  staffProfiles,
  searchStyles,
  eventsList,
  appBarNav,
  storybookSupportStyles,
].join('\n');

const wpPageMarkup = [
  renderAppBar(),
  renderSearchSheet(),
  renderMobileMenu(),
  renderContentSections(),
].join('\n');

interface BuildOptions {
  theme?: WordPressThemeMode;
  includeRuntime?: boolean;
}

const buildWordPressDocument = (markup: string, options: BuildOptions = {}) => {
  const { theme = 'light', includeRuntime = true } = options;
  const runtime = includeRuntime ? `\n    <script>${runtimeScript}</script>` : '';
  return `<!DOCTYPE html>
<html lang="en" data-theme="${theme}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>${combinedStyles}</style>
  </head>
  <body>
    ${markup}
    ${runtime}
  </body>
</html>`;
};

export const buildWordPressPageHtml = (theme: WordPressThemeMode = 'light') =>
  buildWordPressDocument(wpPageMarkup, { theme });

export const buildWordPressComponentHtml = (
  markup: string,
  options?: BuildOptions,
) => buildWordPressDocument(markup, options);
