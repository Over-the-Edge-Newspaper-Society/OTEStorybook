import { renderThemeToggleBlock } from './themeToggle';

const navLinks = [
  { href: 'https://overtheedge.unbc.ca/calendar/', label: 'Calendar' },
  { href: 'https://overtheedge.unbc.ca/clubs/', label: 'Clubs' },
  { href: 'https://overtheedge.unbc.ca/news/', label: 'News' },
  { href: 'https://overtheedge.unbc.ca/get-involved/', label: 'Get Involved' },
  { href: 'https://overtheedge.unbc.ca/about-us/', label: 'About Us' },
  { href: 'https://overtheedge.unbc.ca/contact/', label: 'Contact' },
];

const renderLogo = () => `
<div class="ote-logo-wrapper ote-logo--full ote-logo--align-left ote-logo--valign-center ote-logo--has-darkmode">
  <a href="https://overtheedge.unbc.ca/" class="ote-logo-link" aria-label="Over the Edge">
    <style>
      #ote-logo-embed {
        --ote-logo-main-color: #155329;
        --ote-logo-subtext-color: #262626;
      }
      [data-theme="dark"] #ote-logo-embed {
        --ote-logo-main-color: #e3efcf;
        --ote-logo-subtext-color: #f7f7f7;
      }
    </style>
    <svg id="ote-logo-embed" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 690.73 118.6" width="250" height="42.93" class="ote-logo ote-logo-full ote-logo-variant-green ote-logo-css-vars">
      <rect width="40" height="40" fill="none" />
      <text x="0" y="80" fill="var(--ote-logo-main-color)" font-family="Inter, sans-serif" font-size="72">OTE</text>
    </svg>
  </a>
</div>`;

const renderSearchButton = () => `
<div class="wp-block-group has-global-padding is-layout-constrained wp-block-group-is-layout-constrained">
  <p>
    <button type="button" id="searchToggle" class="search-toggle" aria-label="Search" data-search-open>
      <span class="search-toggle__icon" aria-hidden="true">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="7"></circle>
          <path d="M21 21l-4.35-4.35"></path>
        </svg>
      </span>
    </button>
  </p>
</div>`;

const renderNavList = () => `
<ul class="wp-block-navigation__container is-responsive items-justified-right wp-block-navigation">
  ${navLinks
    .map(
      (link) => `
      <li class="wp-block-navigation-item wp-block-navigation-link">
        <a class="wp-block-navigation-item__content" href="${link.href}" target="_blank" rel="noreferrer">
          <span class="wp-block-navigation-item__label">${link.label}</span>
        </a>
      </li>`,
    )
    .join('\n')}
</ul>`;

export const renderAppBar = () => `
<header class="wp-block-template-part">
  <div class="wp-block-group ote-app-bar-nav has-global-padding is-layout-constrained wp-block-group-is-layout-constrained">
    <div class="wp-block-group alignwide is-content-justification-space-between is-nowrap is-layout-flex" style="padding-top:var(--wp--preset--spacing--30);padding-bottom:var(--wp--preset--spacing--30)">
      <div class="wp-block-group has-global-padding is-layout-constrained wp-block-group-is-layout-constrained">
        ${renderLogo()}
      </div>

      <div class="wp-block-group is-content-justification-right is-nowrap is-layout-flex">
        ${renderSearchButton()}
        ${renderThemeToggleBlock({ id: 'themeToggle', label: 'Switch to light mode' })}
        <nav class="is-responsive items-justified-right wp-block-navigation is-content-justification-right is-layout-flex" aria-label="Navigation">
          <button aria-haspopup="dialog" aria-label="Open menu" class="wp-block-navigation__responsive-container-open" data-mobile-menu-open>
            <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <rect x="4" y="7.5" width="16" height="1.5"></rect>
              <rect x="4" y="15" width="16" height="1.5"></rect>
            </svg>
          </button>
          <div class="wp-block-navigation__responsive-container has-text-color has-contrast-color has-background has-base-background-color">
            <div class="wp-block-navigation__responsive-close">
              <div class="wp-block-navigation__responsive-dialog" role="dialog" aria-modal="false">
                <button aria-label="Close menu" class="wp-block-navigation__responsive-container-close">&times;</button>
                <div class="wp-block-navigation__responsive-container-content">
                  ${renderNavList()}
                </div>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </div>
  </div>
</header>
`;
