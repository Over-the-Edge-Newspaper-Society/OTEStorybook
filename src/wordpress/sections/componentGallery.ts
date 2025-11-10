import { renderOrganizationCardDemo } from './organization';
import { renderSearchSheetStatic } from './search';
import { renderThemeToggleBlock } from './themeToggle';

export const renderComponentGallery = () => `
<section class="component-gallery" aria-label="Component gallery">
  <h2>Component Gallery</h2>
  <p class="component-gallery__intro">Reference for individual Gutenberg pieces used across the child theme.</p>
  <div class="component-grid">
    <article class="component-demo">
      <div class="component-demo__header">
        <h3>Organization Card</h3>
        <p>Query Loop item styling (cards, staff grid, clubs pages).</p>
      </div>
      <div class="organization-grid organization-grid--demo">
        ${renderOrganizationCardDemo()}
      </div>
    </article>

    <article class="component-demo">
      <div class="component-demo__header">
        <h3>Button Set</h3>
        <p>Primary, outline, ghost, and icon controls.</p>
      </div>
      <div class="button-grid button-grid--demo">
        <button class="btn btn--primary" type="button">Primary</button>
        <button class="btn btn--outline" type="button">Outline</button>
        <button class="btn btn--ghost" type="button">Ghost</button>
        <button class="btn icon-btn" type="button" aria-label="Bookmark">★</button>
      </div>
    </article>

    <article class="component-demo">
      <div class="component-demo__header">
        <h3>Dark Mode Toggle</h3>
        <p>Shortcode-powered toggle embedded across the site.</p>
      </div>
      ${renderThemeToggleBlock({ id: 'componentGalleryToggle', label: 'Switch to light mode' })}
    </article>

    <article class="component-demo">
      <div class="component-demo__header">
        <h3>Search Button</h3>
        <p>Inline trigger used in the masthead and app shell.</p>
      </div>
      <button class="icon-btn" type="button" data-search-open>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="7"></circle>
          <line x1="16.65" y1="16.65" x2="21" y2="21"></line>
        </svg>
        <span>Open search</span>
      </button>
    </article>

    <article class="component-demo component-demo--search">
      <div class="component-demo__header">
        <h3>Search Dialogue</h3>
        <p>Popup layout (desktop + mobile) shown in a static frame.</p>
      </div>
      ${renderSearchSheetStatic()}
    </article>
  </div>
</section>
`;
