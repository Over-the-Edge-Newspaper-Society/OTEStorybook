import { recentSearches, searchResults, trendingQueries } from '../data';

const buildTrendingChips = (options: { interactive?: boolean } = {}) => {
  const { interactive = true } = options;
  const dataAttr = interactive ? (query: string) => ` data-search-chip="${query}"` : () => '';
  return trendingQueries
    .map((query) => `<button class="chip" type="button"${dataAttr(query)}>${query}</button>`)
    .join('\n');
};

const buildRecentSearches = (options: { interactive?: boolean } = {}) => {
  const { interactive = true } = options;
  const dataAttr = interactive ? (entry: string) => ` data-search-chip="${entry}"` : () => '';
  return recentSearches
    .map((entry) => `<li><button type="button"${dataAttr(entry)}>${entry}</button></li>`)
    .join('\n');
};

const buildSearchResults = (options: { includeDataAttributes?: boolean } = {}) => {
  const { includeDataAttributes = true } = options;
  const dataAttr = includeDataAttributes ? ' data-search-result' : '';
  return searchResults
    .map(
      (result) => `
      <div class="search-section">
        <p class="search-section__title">${result.eyebrow}</p>
        <a class="search-item" href="#"${dataAttr} data-keywords="${result.keywords}">
          <span class="search-item__icon" aria-hidden="true">${result.icon}</span>
          <div class="search-item__content">
            <p class="search-item__title">${result.title}</p>
            <p class="search-item__excerpt">${result.description}</p>
          </div>
          <span class="search-item__meta">${result.meta}</span>
        </a>
      </div>
    `,
    )
    .join('\n');
};

export const renderSearchSheet = () => `
<div class="search-sheet" id="search-sheet" role="dialog" aria-modal="true" aria-label="Global search" data-open="false">
  <div class="search-sheet__panel">
    <div class="search-sheet__head">
      <h2 class="search-sheet__title">Search Over The Edge</h2>
      <button class="search-sheet__close" type="button" aria-label="Close search" data-search-close>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 6L6 18M6 6l12 12"></path>
        </svg>
      </button>
    </div>
    <div class="search-sheet__content">
      <div class="search-input-wrapper">
        <span class="search-input-icon" aria-hidden="true">🔍</span>
        <input type="search" class="search-input" placeholder="Search clubs, events, or staff" data-search-input />
        <div class="search-shortcuts" aria-hidden="true"><kbd>⌘</kbd><kbd>K</kbd></div>
      </div>
      <div class="search-meta">
        <div>
          <p class="eyebrow">Trending</p>
          <div class="chip-row search-chip-row">${buildTrendingChips()}</div>
        </div>
        <div>
          <p class="eyebrow">Recent</p>
          <ul class="search-recent">${buildRecentSearches()}</ul>
        </div>
      </div>
      <div class="search-results" id="search-results">
        ${buildSearchResults()}
      </div>
      <div class="search-empty" id="search-empty-state">
        <p>No matches yet. Try “clubs fair” or “payment tiers”.</p>
      </div>
    </div>
  </div>
</div>
`;

export const renderSearchSheetStatic = () => `
<div class="search-sheet search-sheet--demo" role="dialog" aria-label="Search dialog demo" data-open="true">
  <div class="search-sheet__panel">
    <div class="search-sheet__head">
      <h2 class="search-sheet__title">Search Dialogue</h2>
      <button class="search-sheet__close" type="button" aria-label="Close">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 6L6 18M6 6l12 12"></path>
        </svg>
      </button>
    </div>
    <div class="search-sheet__content">
      <div class="search-input-wrapper">
        <span class="search-input-icon" aria-hidden="true">🔍</span>
        <input type="search" class="search-input" placeholder="Search (static preview)" />
        <div class="search-shortcuts" aria-hidden="true"><kbd>⌘</kbd><kbd>K</kbd></div>
      </div>
      <div class="search-meta">
        <div>
          <p class="eyebrow">Trending</p>
          <div class="chip-row search-chip-row">${buildTrendingChips({ interactive: false })}</div>
        </div>
        <div>
          <p class="eyebrow">Recent</p>
          <ul class="search-recent">${buildRecentSearches({ interactive: false })}</ul>
        </div>
      </div>
      <div class="search-results">
        ${buildSearchResults({ includeDataAttributes: false })}
      </div>
    </div>
  </div>
</div>
`;
