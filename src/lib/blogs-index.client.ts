type BlogApiRow = {
  slug: string;
  category: string;
  title: string;
  shortDescription: string;
  createdAt: string;
  imageUrl: string | null;
};

type BlogApiResponse = {
  status: string;
  data: {
    items: BlogApiRow[];
    total: number;
  };
};

type CategoriesApiResponse = {
  status: string;
  data: string[];
};

function formatDate(iso: string): { date: string; dateIso: string } {
  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) {
    return { date: '', dateIso: iso };
  }
  return {
    date: parsed.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }),
    dateIso: parsed.toISOString().slice(0, 10),
  };
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderCard(post: BlogApiRow, index: number): string {
  const { date, dateIso } = formatDate(post.createdAt);
  const thumbStyle = post.imageUrl
    ? `background-image:url('${post.imageUrl}');background-size:cover;background-position:center;`
    : '';
  const hidden = index >= 9 ? ' hidden' : '';

  return `<a
    href="/blogs/${escapeHtml(post.slug)}"
    class="blog-card${hidden}"
    data-category="${escapeHtml(post.category)}"
    data-search-text="${escapeHtml(`${post.title} ${post.shortDescription} ${post.category}`)}"
    data-index="${index}"
  >
    <div class="blog-card__body">
      <div class="blog-card__thumb" aria-hidden="true"${thumbStyle ? ` style="${thumbStyle}"` : ''}></div>
      <span class="blog-card__category">${escapeHtml(post.category)}</span>
      <h3 class="blog-card__title">${escapeHtml(post.title)}</h3>
      <p class="blog-card__excerpt">${escapeHtml(post.shortDescription)}</p>
    </div>
    <div class="blog-card__foot">
      <div class="blog-card__divider" aria-hidden="true"></div>
      <div class="blog-card__meta">
        <time class="blog-card__date" datetime="${dateIso}">${escapeHtml(date)}</time>
        <span class="blog-card__read">Read More</span>
      </div>
    </div>
  </a>`;
}

function renderFilter(category: string, isActive: boolean): string {
  return `<button
    type="button"
    class="blogs-filter${isActive ? ' blogs-filter--active' : ''}"
    data-filter="${escapeHtml(category)}"
    role="tab"
    aria-selected="${isActive ? 'true' : 'false'}"
  >${escapeHtml(category)}</button>`;
}

export async function hydrateBlogIndex(apiBase: string): Promise<boolean> {
  const grid = document.getElementById('blogs-grid');
  if (!grid?.querySelector('.blogs-empty')) return false;

  const [postsRes, categoriesRes] = await Promise.all([
    fetch(`${apiBase}/public/blog-posts?limit=100`),
    fetch(`${apiBase}/public/blog-categories`),
  ]);

  if (!postsRes.ok) return false;

  const postsJson = (await postsRes.json()) as BlogApiResponse;
  const posts = postsJson.data?.items ?? [];
  if (posts.length === 0) return false;

  grid.innerHTML = posts.map((post, index) => renderCard(post, index)).join('');

  const filtersEl = document.querySelector('.blogs-filters');
  if (filtersEl && categoriesRes.ok) {
    const categoriesJson = (await categoriesRes.json()) as CategoriesApiResponse;
    const categories = categoriesJson.data ?? [];
    filtersEl.innerHTML = [
      renderFilter('All posts', true),
      ...categories.map((category) => renderFilter(category, false)),
    ].join('');
  }

  document.dispatchEvent(new CustomEvent('blogs:hydrated'));
  return true;
}
