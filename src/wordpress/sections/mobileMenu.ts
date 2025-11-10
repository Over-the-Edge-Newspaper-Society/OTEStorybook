import { renderThemeToggleButton } from './themeToggle';

export const renderMobileMenu = () => `
<div class="mobile-menu-overlay" id="mobile-menu-overlay" data-open="false" role="dialog" aria-modal="true" aria-label="Mobile navigation">
  <div class="mobile-menu-panel">
    <div class="mobile-menu-header">
      <div class="brand">
        <span class="brand__logo" aria-hidden="true">OTE</span>
        <span class="brand__name">Over The Edge</span>
      </div>
      <button class="icon-btn" type="button" aria-label="Close menu" data-mobile-menu-close>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 6L6 18M6 6l12 12"></path>
        </svg>
      </button>
    </div>
    <nav class="mobile-menu-nav">
      <a class="nav-link" href="#">News</a>
      <a class="nav-link" href="#">Calendar</a>
      <a class="nav-link" href="#">Clubs</a>
      <a class="nav-link" href="#">About</a>
    </nav>
    <div class="mobile-menu-actions">
      ${renderThemeToggleButton({
        id: 'mobileThemeToggle',
        label: 'Switch to light mode',
        extraButtonClasses: 'mobile-menu-theme-toggle',
      })}
      <button class="btn btn--primary" type="button">Submit a story</button>
    </div>
  </div>
</div>
`;
