export const storybookSupportStyles = `
.ote-test-page {
  font-family: var(--font-ui);
  padding: 48px clamp(1rem, 3vw, 48px);
  max-width: 1120px;
  margin: 0 auto 120px;
  display: flex;
  flex-direction: column;
  gap: 48px;
  color: var(--text, #0f172a);
}

.hero-card,
.toggle-card,
.status-card,
.button-grid,
.chip-row,
.card-grid,
.organization-grid,
.news-grid {
  width: 100%;
}

.hero-card {
  border-radius: 24px;
  background: linear-gradient(135deg, #2d5f3f 0%, #4a7c59 100%);
  color: white;
  padding: clamp(2rem, 4vw, 4rem);
  box-shadow: var(--shadow-lg);
}

.hero-card h1 {
  font-size: clamp(2.4rem, 6vw, 3.5rem);
  margin: 0 0 1rem 0;
  font-family: var(--font-serif);
}

.hero-card .hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 1.5rem;
}

.eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.2em;
  font-size: 0.75rem;
  opacity: 0.9;
}

.button-section .button-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.card-grid-section .card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 24px;
}

.card-media {
  width: 100%;
  aspect-ratio: 16/9;
  border-radius: 16px;
  margin-bottom: 1rem;
}

.gradient-emerald {
  background: linear-gradient(135deg, #14b8a6, #0f766e);
}

.gradient-gold {
  background: linear-gradient(135deg, #f4b942, #f97316);
}

.gradient-indigo {
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
}

.compact-card {
  display: flex;
  gap: 16px;
}

.compact-card__media {
  width: 80px;
  height: 80px;
  border-radius: 12px;
  flex-shrink: 0;
}

.card-eyebrow {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-sec, #64748b);
}

.card-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: var(--text-sec, #64748b);
  margin-top: 0.75rem;
}

.chip-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.chip {
  padding: 8px 16px;
  border-radius: 24px;
  border: 1px solid var(--border, #e2e8f0);
  background: var(--card, #fff);
  cursor: pointer;
  transition: all 160ms ease;
}

.chip.is-active,
.chip:hover {
  background: var(--brand, #2d5f3f);
  color: #fff;
  border-color: transparent;
}

.news-grid-section .news-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 20px;
}

.news-card {
  border-radius: 16px;
  border: 1px solid var(--border, #e2e8f0);
  padding: 20px;
  background: var(--card, #fff);
  box-shadow: var(--shadow-sm);
}

.news-card.highlight {
  background: linear-gradient(135deg, rgba(77, 124, 15, 0.1), rgba(34, 197, 94, 0.15));
}

.toggle-card {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 24px;
  border-radius: 16px;
  border: 1px solid var(--border, #e2e8f0);
  background: var(--card, #fff);
  box-shadow: var(--shadow-sm);
}

.theme-toggle {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border-radius: 999px;
  border: 2px solid var(--brand, #2d5f3f);
  color: var(--brand, #2d5f3f);
  background: transparent;
  cursor: pointer;
  transition: all 160ms ease;
  font-weight: 600;
}

.theme-toggle:hover {
  background: var(--brand, #2d5f3f);
  color: #fff;
}

.theme-toggle__icon {
  transition: transform 200ms ease, opacity 200ms ease;
}

[data-theme='dark'] .theme-toggle__icon--sun {
  opacity: 0;
  transform: translateY(8px);
}

[data-theme='dark'] .theme-toggle__icon--moon {
  opacity: 1;
  transform: translateY(0);
}

.theme-toggle__icon--moon {
  opacity: 0;
  transform: translateY(-8px);
}

.status-card {
  border-radius: 16px;
  border: 1px dashed var(--border, #e2e8f0);
  padding: 16px;
  background: var(--muted, #f8fafc);
  font-family: var(--font-mono, 'IBM Plex Mono', monospace);
}

.component-gallery {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.component-gallery__intro {
  color: var(--text-sec, #64748b);
  margin: 0;
}

.component-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 18px;
}

.component-demo {
  border: 1px solid var(--border, #e2e8f0);
  border-radius: 18px;
  padding: 18px;
  background: var(--card, #fff);
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.component-demo__header h3 {
  margin: 0 0 4px 0;
}

.component-demo__header p {
  margin: 0;
  color: var(--text-sec, #64748b);
  font-size: 0.9rem;
}

.component-demo button {
  width: fit-content;
}

.button-grid--demo {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.organization-grid--demo .organization-card {
  margin: 0;
}

.component-demo--search .search-sheet {
  position: relative;
  inset: auto;
  width: 100%;
  height: auto;
  opacity: 1;
  pointer-events: none;
  background: transparent;
  backdrop-filter: none;
}

.search-sheet--demo .search-sheet__panel {
  width: 100%;
  max-width: 100%;
  transform: none;
  opacity: 1;
  margin: 0;
  box-shadow: var(--shadow-md);
}

.search-sheet--demo .search-sheet__content {
  gap: 16px;
}

.search-sheet--demo .search-results {
  max-height: 280px;
}

.component-demo--search .search-sheet__close {
  pointer-events: none;
}

@media (max-width: 640px) {
  .card-meta {
    flex-direction: column;
    gap: 4px;
  }
}

/* Organization Directory Showcase */
.organization-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.organization-page__header {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.organization-page__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
}

.org-search {
  flex: 1;
  min-width: 240px;
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid var(--border);
  border-radius: 999px;
  padding: 6px 12px;
  background: var(--card, #fff);
}

.org-search__icon {
  color: var(--text-sec, #64748b);
}

[data-theme='dark'] .org-search {
  background: var(--surface);
}

.org-search input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 0.95rem;
  font-family: inherit;
}

.org-search input:focus {
  outline: none;
}

.org-search__clear {
  border: none;
  background: transparent;
  color: var(--text-sec, #64748b);
  cursor: pointer;
  opacity: 0;
  transform: scale(0.8);
  transition: opacity 160ms ease, transform 160ms ease;
}

.org-search[data-has-value='true'] .org-search__clear {
  opacity: 1;
  transform: scale(1);
}

.org-filter-row {
  flex: 2;
}

.organization-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 20px;
}

.organization-card {
  border: 1px solid var(--border, #e2e8f0);
  border-radius: 20px;
  padding: 20px;
  background: var(--card, #fff);
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 260px;
}

.organization-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.organization-card__logo {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: var(--muted, #f1f5f9);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
}

.organization-card__tag {
  font-size: 0.8rem;
  color: var(--text-sec, #64748b);
}

.organization-card__meta {
  font-size: 0.85rem;
  color: var(--text-sec, #64748b);
}

.organization-card__pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 0.8rem;
  padding: 6px 12px;
  border-radius: 999px;
  background: var(--muted, #f1f5f9);
  color: var(--text-sec, #64748b);
  width: fit-content;
}

.organization-page__meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.9rem;
  color: var(--text-sec, #64748b);
}

#org-count {
  font-weight: 600;
  color: var(--text, #0f172a);
}

/* Search component callouts */
.search-components {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.search-component-card {
  border: 1px solid var(--border, #e2e8f0);
  border-radius: 18px;
  padding: 18px;
  background: var(--card, #fff);
  box-shadow: var(--shadow-sm);
}

.search-shortcut {
  display: inline-flex;
  gap: 6px;
  align-items: center;
  font-family: var(--font-mono, 'IBM Plex Mono', monospace);
  font-size: 0.85rem;
  color: var(--text-sec, #64748b);
}

.search-shortcut kbd {
  border: 1px solid var(--border, #cbd5f5);
  border-radius: 6px;
  padding: 2px 6px;
  background: var(--muted, #f1f5f9);
}

.mobile-shell-section {
  border: 1px solid var(--border, #e2e8f0);
  border-radius: 20px;
  padding: 24px;
  background: var(--card, #fff);
  box-shadow: var(--shadow-sm);
}

.mobile-shell-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 16px;
}

.mobile-shell-hint {
  font-size: 0.9rem;
  color: var(--text-sec, #64748b);
}

.search-chip-row .chip {
  padding: 6px 12px;
  font-size: 0.85rem;
}

.search-recent {
  list-style: none;
  padding: 0;
  margin: 8px 0 0 0;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.search-recent button {
  border: 1px solid var(--border, #e2e8f0);
  border-radius: 999px;
  padding: 6px 12px;
  background: transparent;
  cursor: pointer;
}

#search-empty-state {
  display: none;
}

.search-item__meta {
  margin-left: auto;
  font-size: 0.78rem;
  color: var(--text-sec, #64748b);
}

.search-meta {
  display: grid;
  gap: 18px;
  padding: 12px 0;
}

.search-meta .eyebrow {
  margin-bottom: 6px;
}

.search-input-icon {
  color: var(--text-sec, #64748b);
}

.search-shortcuts {
  display: inline-flex;
  gap: 4px;
  font-size: 0.8rem;
  color: var(--text-sec, #64748b);
}

.search-shortcuts kbd {
  border: 1px solid var(--border, #e2e8f0);
  border-radius: 6px;
  padding: 2px 6px;
  background: var(--muted, #f1f5f9);
}

@media (max-width: 640px) {
  .organization-page__actions {
    flex-direction: column;
    align-items: stretch;
  }

  .org-filter-row {
    width: 100%;
  }

  .organization-page__meta {
    flex-direction: column;
    gap: 8px;
  }
}
`;
