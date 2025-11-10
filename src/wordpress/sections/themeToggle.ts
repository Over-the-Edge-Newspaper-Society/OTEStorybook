interface ThemeToggleOptions {
  id?: string;
  label?: string;
  extraButtonClasses?: string;
  includeGroupWrapper?: boolean;
}

const sunIcon = `
<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
  <circle cx="12" cy="12" r="4"></circle>
  <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"></path>
</svg>`;

const moonIcon = `
<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
  <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"></path>
</svg>`;

const renderToggleButton = ({
  id,
  label = 'Switch to light mode',
  extraButtonClasses = '',
}: ThemeToggleOptions = {}) => `
<button type="button"
  ${id ? `id="${id}"` : ''}
  class="ote-theme-toggle theme-toggle ${extraButtonClasses}" 
  aria-label="${label}"
  data-theme-toggle>
  <span class="theme-toggle__icon theme-toggle__icon--sun" aria-hidden="true">
    ${sunIcon}
  </span>
  <span class="theme-toggle__icon theme-toggle__icon--moon" aria-hidden="true">
    ${moonIcon}
  </span>
</button>`;

export const renderThemeToggleBlock = (options?: ThemeToggleOptions) => `
<div class="wp-block-group is-layout-flow wp-block-group-is-layout-flow">
  <p>
    ${renderToggleButton(options)}
  </p>
</div>`;

export const renderThemeToggleButton = (options?: ThemeToggleOptions) => renderToggleButton(options);
