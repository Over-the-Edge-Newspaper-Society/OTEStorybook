import { renderComponentGallery } from './componentGallery';
import { renderOrganizationSection } from './organization';
import { renderThemeToggleBlock } from './themeToggle';

export const renderContentSections = () => `
<div class="ote-test-page">
  <section class="hero-block">
    <div class="wp-block-group is-style-ote-hero hero-card">
      <p class="eyebrow">Over The Edge · UNBC</p>
      <h1>WordPress Theme System</h1>
      <p class="body-l">A living reference for the block styles, gradients, typography, and interactions bundled with the child theme.</p>
      <div class="hero-actions">
        <a class="btn btn--primary" href="#">Explore Articles</a>
        <a class="btn btn--ghost" href="#">Visit WordPress</a>
      </div>
    </div>
  </section>

  <section class="button-section">
    <h2>Buttons</h2>
    <div class="button-grid">
      <button class="btn btn--primary" type="button">Primary</button>
      <button class="btn btn--outline" type="button">Outline</button>
      <button class="btn btn--ghost" type="button">Ghost</button>
      <button class="btn icon-btn" type="button" aria-label="Bookmark article">★</button>
    </div>
  </section>

  <section class="card-grid-section">
    <h2>Story Cards</h2>
    <div class="card-grid">
      <article class="wp-block-group is-style-ote-card">
        <div class="card-media gradient-emerald"></div>
        <span class="card-eyebrow">Campus Life</span>
        <h3>Spring clubs fair welcomes new students</h3>
        <p>The annual event pairs new students with clubs and services across campus.</p>
        <div class="card-meta">
          <span>Apr 17, 2025</span>
          <span>Staff Writer</span>
        </div>
      </article>
      <article class="wp-block-group is-style-ote-card-animated">
        <div class="card-media gradient-gold"></div>
        <span class="card-eyebrow">Investigative</span>
        <h3>How student transit improvements are funded</h3>
        <p>A look behind the scenes at the levy keeping buses moving every 15 minutes.</p>
        <div class="card-meta">
          <span>Apr 12, 2025</span>
          <span>Opinion Desk</span>
        </div>
      </article>
      <article class="wp-block-group is-style-ote-card-compact">
        <div class="compact-card">
          <div class="compact-card__media gradient-indigo"></div>
          <div>
            <h3>Five professors receive national awards</h3>
            <p>Faculty honoured for mentorship, climate research, and contributions to open science.</p>
            <div class="card-meta">
              <span>Apr 2, 2025</span>
              <span>Features</span>
            </div>
          </div>
        </div>
      </article>
    </div>
  </section>

  <section class="chips-tabs-section">
    <h2>Filter Chips</h2>
    <div class="chip-row">
      <button class="chip is-active" type="button">All</button>
      <button class="chip" type="button">News</button>
      <button class="chip" type="button">Opinion</button>
      <button class="chip" type="button">Culture</button>
      <button class="chip" type="button">Sports</button>
    </div>
  </section>

  ${renderOrganizationSection()}

  <section class="news-grid-section">
    <h2>News Grid</h2>
    <div class="news-grid">
      <article class="news-card">
        <p class="card-eyebrow">Feature</p>
        <h3>Meet the investigative team documenting wildfire impacts</h3>
        <p>Reporters spend the summer embedded with communities across the north.</p>
      </article>
      <article class="news-card highlight">
        <p class="card-eyebrow">Highlight</p>
        <h3>Design refresh rolls out across UNBC WordPress sites</h3>
        <p>The updated OTE system brings consistent typography, spacing, and dark mode.</p>
      </article>
      <article class="news-card">
        <p class="card-eyebrow">Opinion</p>
        <h3>Why accessible transit matters for student journalists</h3>
        <p>A column about covering the region without a car.</p>
      </article>
    </div>
  </section>

  ${renderComponentGallery()}

  <section class="mobile-shell-section">
    <h2>Mobile navigation & search</h2>
    <p class="mobile-shell-hint">Use the Storybook viewport toolbar to switch to “Small Mobile” and preview the mobile nav + sheet animations.</p>
    <div class="mobile-shell-actions">
      <button class="icon-btn" type="button" data-mobile-menu-open>Open mobile menu</button>
      <button class="icon-btn" type="button" data-search-open>Open search sheet</button>
      <div class="search-shortcut"><kbd>⌘</kbd><kbd>K</kbd> opens search</div>
    </div>
  </section>

  <section class="search-components">
    <div class="search-component-card">
      <p class="eyebrow">Global search</p>
      <p>Search sheet adapts for desktop and mobile, reusing the same CSS tokens.</p>
      <button class="chip" type="button" data-search-chip="calendar">Try “calendar”</button>
    </div>
    <div class="search-component-card">
      <p class="eyebrow">Recent queries</p>
      <p>Recent searches hydrate from WordPress user meta or local storage.</p>
    </div>
    <div class="search-component-card">
      <p class="eyebrow">Dark mode tokens</p>
      <p>Try the Storybook theme toggle or the in-page button below.</p>
    </div>
  </section>

  <section class="toggle-section">
    <div class="toggle-card">
      <div>
        <h2>WordPress Dark Mode Toggle</h2>
        <p class="body-m">Click to simulate the shortcode-powered toggle embedded across the child theme.</p>
      </div>
      ${renderThemeToggleBlock({ id: 'wp-theme-toggle', label: 'Switch to light mode' })}
    </div>
    <div id="wp-theme-status" class="status-card">Detecting theme tokens…</div>
  </section>
</div>
`;
