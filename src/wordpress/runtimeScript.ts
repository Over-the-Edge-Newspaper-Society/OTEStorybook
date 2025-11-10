export const runtimeScript = `
(() => {
  const doc = document;
  const root = doc.documentElement;
  const body = doc.body;
  const searchSheet = doc.getElementById('search-sheet');
  const mobileMenu = doc.getElementById('mobile-menu-overlay');
  const searchInput = doc.querySelector('[data-search-input]');
  const searchResults = Array.from(doc.querySelectorAll('[data-search-result]'));
  const searchEmpty = doc.getElementById('search-empty-state');
  const orgSearch = doc.querySelector('[data-org-search]');
  const orgClear = doc.querySelector('[data-org-clear]');
  const orgCards = Array.from(doc.querySelectorAll('[data-org-card]'));
  const orgFilters = Array.from(doc.querySelectorAll('[data-org-filter]'));
  const orgCount = doc.getElementById('org-count');
  const themeButtons = Array.from(doc.querySelectorAll('[data-theme-toggle]'));
  const searchOpeners = doc.querySelectorAll('[data-search-open]');
  const searchClosers = doc.querySelectorAll('[data-search-close]');
  const menuOpeners = doc.querySelectorAll('[data-mobile-menu-open]');
  const menuClosers = doc.querySelectorAll('[data-mobile-menu-close]');
  const searchChips = doc.querySelectorAll('[data-search-chip]');
  const statusCard = doc.getElementById('wp-theme-status');

  let activeOverlay = null;
  let activeOrgFilter = 'all';

  const setBodyOverlay = (type) => {
    activeOverlay = type;
    if (type) {
      body.dataset.overlay = type;
      body.style.overflow = 'hidden';
    } else {
      delete body.dataset.overlay;
      body.style.overflow = '';
    }
  };

  const renderThemeStatus = () => {
    if (!statusCard) return;
    const theme = root.getAttribute('data-theme') || 'light';
    const brand = getComputedStyle(root).getPropertyValue('--brand').trim() || 'var(--brand)';
    statusCard.innerHTML = '<strong>Current Theme:</strong> ' + theme +
      '<br><strong>--brand:</strong> ' + brand;
  };

  const applyTheme = (next) => {
    root.setAttribute('data-theme', next);
    root.dataset.themeMode = next;
    try {
      localStorage.setItem('ote-wp-theme-preview', next);
    } catch (error) {
      // ignore storage errors in sandboxed storybooks
    }
    renderThemeStatus();
  };

  themeButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const current = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  });

  const filterSearchResults = () => {
    const query = (searchInput?.value || '').trim().toLowerCase();
    let visible = 0;
    searchResults.forEach((item) => {
      const keywords = item.getAttribute('data-keywords') || '';
      const text = (item.textContent || '').toLowerCase();
      const matches = !query || keywords.includes(query) || text.includes(query);
      item.style.display = matches ? '' : 'none';
      if (matches) visible += 1;
    });
    if (searchEmpty) {
      searchEmpty.style.display = visible === 0 ? 'block' : 'none';
    }
  };

  const toggleSearchSheet = (open) => {
    if (!searchSheet) return;
    searchSheet.setAttribute('data-open', open ? 'true' : 'false');
    if (open) {
      setBodyOverlay('search');
      searchInput?.focus();
    } else if (activeOverlay === 'search') {
      searchInput?.blur();
      setBodyOverlay(null);
    }
  };

  const toggleMobileMenu = (open) => {
    if (!mobileMenu) return;
    mobileMenu.setAttribute('data-open', open ? 'true' : 'false');
    if (open) {
      setBodyOverlay('menu');
    } else if (activeOverlay === 'menu') {
      setBodyOverlay(null);
    }
  };

  searchOpeners.forEach((opener) => {
    opener.addEventListener('click', () => {
      toggleMobileMenu(false);
      toggleSearchSheet(true);
    });
  });

  searchClosers.forEach((closer) => {
    closer.addEventListener('click', () => toggleSearchSheet(false));
  });

  menuOpeners.forEach((opener) => opener.addEventListener('click', () => {
    toggleSearchSheet(false);
    toggleMobileMenu(true);
  }));

  menuClosers.forEach((closer) => closer.addEventListener('click', () => toggleMobileMenu(false)));

  searchInput?.addEventListener('input', filterSearchResults);
  filterSearchResults();

  searchChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const value = chip.getAttribute('data-search-chip') || '';
      if (searchInput) {
        searchInput.value = value;
        filterSearchResults();
      }
      toggleSearchSheet(true);
    });
  });

  const updateOrgSearchState = () => {
    const wrapper = orgSearch?.closest('.org-search');
    if (!wrapper) return;
    const hasValue = Boolean(orgSearch?.value);
    wrapper.setAttribute('data-has-value', hasValue ? 'true' : 'false');
  };

  const applyOrgFilters = () => {
    const term = (orgSearch?.value || '').trim().toLowerCase();
    let visible = 0;
    orgCards.forEach((card) => {
      const tags = (card.getAttribute('data-tags') || '').toLowerCase();
      const text = (card.textContent || '').toLowerCase();
      const matchesFilter = activeOrgFilter === 'all' || tags.includes(activeOrgFilter);
      const matchesTerm = !term || text.includes(term);
      const show = matchesFilter && matchesTerm;
      card.style.display = show ? '' : 'none';
      if (show) visible += 1;
    });
    if (orgCount) {
      orgCount.textContent = visible + ' ' + (visible === 1 ? 'club' : 'clubs');
    }
  };

  orgFilters.forEach((filter) => {
    filter.addEventListener('click', () => {
      activeOrgFilter = filter.getAttribute('data-org-filter') || 'all';
      orgFilters.forEach((btn) => btn.classList.toggle('is-active', btn === filter));
      applyOrgFilters();
    });
  });

  orgSearch?.addEventListener('input', () => {
    updateOrgSearchState();
    applyOrgFilters();
  });

  orgClear?.addEventListener('click', () => {
    if (!orgSearch) return;
    orgSearch.value = '';
    orgSearch.focus();
    updateOrgSearchState();
    applyOrgFilters();
  });

  updateOrgSearchState();
  applyOrgFilters();
  renderThemeStatus();

  doc.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase();
    if ((event.metaKey || event.ctrlKey) && key === 'k') {
      event.preventDefault();
      toggleMobileMenu(false);
      toggleSearchSheet(true);
    }
    if (key === 'escape') {
      if (activeOverlay === 'search') {
        toggleSearchSheet(false);
      } else if (activeOverlay === 'menu') {
        toggleMobileMenu(false);
      }
    }
  });
})();
`;
