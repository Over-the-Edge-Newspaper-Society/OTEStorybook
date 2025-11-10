import { organizationCards, type OrganizationCardContent } from '../data';

type OrganizationCardOptions = {
  interactive?: boolean;
};

export const renderOrganizationCard = (
  card: OrganizationCardContent,
  options: OrganizationCardOptions = {},
) => {
  const { interactive = false } = options;
  const dataAttrs = interactive ? ` data-org-card data-tags="${card.tags.join(' ')}"` : '';

  return `
    <article class="organization-card"${dataAttrs}>
      <div class="organization-card__header">
        <div class="organization-card__logo">${card.short}</div>
        <span class="organization-card__tag">${card.tag}</span>
      </div>
      <h3>${card.title}</h3>
      <p>${card.description}</p>
      <p class="organization-card__meta">✉️ ${card.contact}</p>
      <p class="organization-card__meta">🗓️ ${card.meeting}</p>
      <span class="organization-card__pill">${card.status}</span>
      <div class="chip-row">
        <button class="chip" type="button">View profile</button>
        <button class="chip" type="button">Contact</button>
      </div>
    </article>
  `;
};

export const renderOrganizationSection = () => `
<section class="organization-page">
  <div class="organization-page__header">
    <p class="eyebrow">Clubs & Resources</p>
    <h2>Organization directory showcase</h2>
    <p>Search, filter, and scan the cards that power the WordPress organization template.</p>
  </div>
  <div class="organization-page__actions">
    <div class="org-search" data-has-value="false">
      <span class="org-search__icon" aria-hidden="true">🔎</span>
      <input type="search" placeholder="Search clubs" aria-label="Search clubs" data-org-search />
      <button class="org-search__clear" type="button" aria-label="Clear search" data-org-clear>✕</button>
    </div>
    <div class="chip-row org-filter-row">
      <button class="chip is-active" type="button" data-org-filter="all">All</button>
      <button class="chip" type="button" data-org-filter="tech">Tech</button>
      <button class="chip" type="button" data-org-filter="advocacy">Advocacy</button>
      <button class="chip" type="button" data-org-filter="services">Services</button>
      <button class="chip" type="button" data-org-filter="outdoors">Outdoors</button>
    </div>
  </div>
  <div class="organization-grid">
    ${organizationCards.map((card) => renderOrganizationCard(card, { interactive: true })).join('\n')}
  </div>
  <div class="organization-page__meta">
    <div>
      <strong id="org-count">0 clubs</strong> • Auto-updates as filters change
    </div>
    <div class="chip-row">
      <span class="organization-card__pill">Directory uses WordPress Query Loop</span>
    </div>
  </div>
</section>
`;

export const renderOrganizationCardDemo = () => renderOrganizationCard(organizationCards[0]);
