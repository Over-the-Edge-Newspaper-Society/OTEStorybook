import type { Meta, StoryObj } from '@storybook/react';
import { WordPressThemePreview, type WordPressThemePreviewProps } from '@/wordpress/WordPressThemePreview';
import {
  buildWordPressComponentHtml,
  type WordPressThemeMode,
} from '@/wordpress/wordpressPage';
import { renderAppBar } from '@/wordpress/sections/appBar';
import { renderComponentGallery } from '@/wordpress/sections/componentGallery';
import {
  renderOrganizationCardDemo,
  renderOrganizationSection,
} from '@/wordpress/sections/organization';
import { renderMobileMenu } from '@/wordpress/sections/mobileMenu';
import { renderSearchSheet, renderSearchSheetStatic } from '@/wordpress/sections/search';
import { renderThemeToggleBlock } from '@/wordpress/sections/themeToggle';

type ThemeControl = 'system' | 'light' | 'dark';
type StoryArgs = WordPressThemePreviewProps & { mode?: ThemeControl };

const meta: Meta<StoryArgs> = {
  title: 'WordPress/Theme Showcase',
  component: WordPressThemePreview,
  tags: ['autodocs'],
  args: {
    minHeight: 1500,
    mode: 'system',
  },
  argTypes: {
    mode: {
      control: 'inline-radio',
      options: ['system', 'light', 'dark'],
      description: 'Sync with the Storybook toolbar (system) or force a theme.',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const resolveTheme = (setting: ThemeControl) => {
  if (setting === 'light' || setting === 'dark') {
    return setting;
  }
  if (typeof window === 'undefined' || !window.matchMedia) {
    return 'light';
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const Template: Story = {
  render: (args, { globals }) => {
    const toolbarTheme = (globals.theme ?? 'system') as ThemeControl;
    const requestedTheme = (args.mode ?? toolbarTheme) as ThemeControl;
    const resolvedTheme = resolveTheme(requestedTheme);

    return (
      <div style={{ padding: '2rem', background: 'var(--background)' }}>
        <WordPressThemePreview
          minHeight={args.minHeight}
          theme={resolvedTheme as 'light' | 'dark'}
          buildHtml={args.buildHtml}
        />
      </div>
    );
  },
};

const wrapInPage = (markup: string) => `<div class="ote-test-page">${markup}</div>`;

const makeBuilder = (
  markupFactory: (theme?: WordPressThemeMode) => string,
  options?: { includeRuntime?: boolean },
) =>
  (theme: WordPressThemeMode) =>
    buildWordPressComponentHtml(markupFactory(theme), {
      theme,
      includeRuntime: options?.includeRuntime,
    });

const searchButtonMarkup = () =>
  [
    wrapInPage(`
      <div class="search-components">
        <div class="search-component-card">
          <p class="eyebrow">Search Button</p>
          <button class="icon-btn" type="button" data-search-open>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="7"></circle>
              <line x1="16.65" y1="16.65" x2="21" y2="21"></line>
            </svg>
            <span>Open search</span>
          </button>
        </div>
      </div>
    `),
    renderSearchSheet(),
  ].join('\n');

const buttonSetMarkup = () =>
  wrapInPage(`
    <section class="button-section">
      <h2>Button Styles</h2>
      <div class="button-grid button-grid--demo">
        <button class="btn btn--primary" type="button">Primary</button>
        <button class="btn btn--outline" type="button">Outline</button>
        <button class="btn btn--ghost" type="button">Ghost</button>
        <button class="btn icon-btn" type="button" aria-label="Bookmark">★</button>
      </div>
    </section>
  `);

const darkModeToggleMarkup = () =>
  wrapInPage(`
    <section class="toggle-section">
      <div class="toggle-card">
        <div>
          <h2>Dark Mode Toggle</h2>
          <p class="body-m">Standalone shortcode demo.</p>
        </div>
        ${renderThemeToggleBlock({ id: 'storybookToggleDemo', label: 'Switch to light mode' })}
      </div>
      <div class="status-card">Click the toggle to switch tokens.</div>
    </section>
  `);

const organizationCardMarkup = () =>
  wrapInPage(`
    <div class="organization-grid organization-grid--demo">
      ${renderOrganizationCardDemo()}
    </div>
  `);

const searchDialogMarkup = () => wrapInPage(renderSearchSheetStatic());

const mobileMenuMarkup = () =>
  [
    wrapInPage(`
      <section class="mobile-shell-section">
        <h2>Mobile Menu Trigger</h2>
        <button class="icon-btn" type="button" data-mobile-menu-open>Open menu</button>
      </section>
    `),
    renderMobileMenu(),
  ].join('\n');

export const SystemTheme: Story = {
  ...Template,
  args: {
    mode: 'system',
  },
};

export const LightOnly: Story = {
  ...Template,
  args: {
    mode: 'light',
  },
};

export const DarkOnly: Story = {
  ...Template,
  args: {
    mode: 'dark',
  },
};

export const AppBarOnly: Story = {
  ...Template,
  args: {
    minHeight: 220,
    buildHtml: makeBuilder(() => renderAppBar(), { includeRuntime: true }),
  },
};

export const OrganizationDirectory: Story = {
  ...Template,
  args: {
    minHeight: 700,
    buildHtml: makeBuilder(() => renderOrganizationSection(), { includeRuntime: true }),
  },
};

export const OrganizationCard: Story = {
  ...Template,
  args: {
    minHeight: 360,
    buildHtml: makeBuilder(() => organizationCardMarkup()),
  },
};

export const ButtonSet: Story = {
  ...Template,
  args: {
    minHeight: 320,
    buildHtml: makeBuilder(() => buttonSetMarkup()),
  },
};

export const DarkModeToggle: Story = {
  ...Template,
  args: {
    minHeight: 280,
    buildHtml: makeBuilder(() => darkModeToggleMarkup(), { includeRuntime: true }),
  },
};

export const SearchButton: Story = {
  ...Template,
  args: {
    minHeight: 480,
    buildHtml: makeBuilder(() => searchButtonMarkup(), { includeRuntime: true }),
  },
};

export const SearchDialog: Story = {
  ...Template,
  args: {
    minHeight: 540,
    buildHtml: makeBuilder(() => searchDialogMarkup()),
  },
};

export const ComponentGalleryOnly: Story = {
  ...Template,
  args: {
    minHeight: 720,
    buildHtml: makeBuilder(() => wrapInPage(renderComponentGallery())),
  },
};

export const MobileMenu: Story = {
  ...Template,
  args: {
    minHeight: 520,
    buildHtml: makeBuilder(() => mobileMenuMarkup(), { includeRuntime: true }),
  },
};
