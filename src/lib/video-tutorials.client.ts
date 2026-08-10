const CHEVRON_RIGHT = '/images/video-tutorials/chevron-right.svg';
const CHEVRON_DOWN = '/images/video-tutorials/chevron-down.svg';

let categoriesCache: Array<{
  id: string;
  title: string;
  lessons: Array<{
    id: string;
    title: string;
    duration: string;
    description: string[];
    videoUrl: string | null;
    categoryTitle: string;
  }>;
}> = [];

let lessonOrder: string[] = [];
let activeLessonIndex = 0;

function setExpanded(panel: HTMLElement, expanded: boolean) {
  panel.hidden = !expanded;
  const inner = panel.closest('.vt-cat__inner');
  const toggle = inner?.querySelector<HTMLButtonElement>('.vt-cat__toggle');
  const category = panel.closest('.vt-cat--accordion');
  if (!toggle) return;

  toggle.setAttribute('aria-expanded', String(expanded));
  category?.classList.toggle('vt-cat--open', expanded);

  const chevron = toggle.querySelector<HTMLImageElement>('.vt-cat__chevron');
  if (chevron) {
    chevron.src = expanded ? CHEVRON_DOWN : CHEVRON_RIGHT;
    chevron.classList.toggle('vt-cat__chevron--collapsed', !expanded);
  }

  const icon = toggle.querySelector<HTMLImageElement>('.vt-cat__icon');
  if (icon) {
    icon.src = expanded
      ? (icon.dataset.iconOpen ?? icon.src)
      : (icon.dataset.iconCollapsed ?? icon.src);
  }
}

function findLesson(lessonId: string) {
  for (const category of categoriesCache) {
    const lesson = category.lessons.find((item) => item.id === lessonId);
    if (lesson) return { category, lesson };
  }
  return null;
}

function readLessonFromButton(button: HTMLButtonElement) {
  const lessonId = button.dataset.lessonId;
  if (!lessonId) return null;

  const cached = findLesson(lessonId);
  if (cached) return cached;

  const categoryEl = button.closest('.vt-cat--accordion');
  const categoryTitle =
    categoryEl?.querySelector('.vt-cat__toggle .vt-cat__label span')?.textContent?.trim() ??
    button.dataset.categoryTitle ??
    '';

  return {
    category: { id: categoryEl?.id ?? '', title: categoryTitle, lessons: [] },
    lesson: {
      id: lessonId,
      title:
        button.querySelector('.vt-sub__label span')?.textContent?.trim() ??
        button.querySelector('.vt-cat__label span')?.textContent?.trim() ??
        '',
      duration:
        button.querySelector('.vt-sub__duration')?.textContent?.trim() ??
        button.querySelector('.vt-cat__duration')?.textContent?.trim() ??
        '',
      description: [],
      videoUrl: button.dataset.videoUrl ?? null,
      categoryTitle,
    },
  };
}

function renderPlayer(playerEl: HTMLElement, title: string, videoUrl: string | null) {
  playerEl.replaceChildren();
  if (videoUrl) {
    const iframe = document.createElement('iframe');
    iframe.src = videoUrl;
    iframe.title = title;
    iframe.allow =
      'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    iframe.allowFullscreen = true;
    iframe.className = 'vt-player__iframe';
    iframe.style.position = 'absolute';
    iframe.style.inset = '0';
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = '0';
    playerEl.appendChild(iframe);
    return;
  }

  const label = document.createElement('p');
  label.className = 'vt-player__label';
  label.textContent = 'Video Player';
  playerEl.appendChild(label);
}

function getLessonSections() {
  return Array.from(document.querySelectorAll<HTMLElement>('.vt-lesson'));
}

function getSidebarScroll() {
  return document.querySelector<HTMLElement>('[data-vt-sidebar-scroll]');
}

function getSectionNav() {
  return document.querySelector<HTMLElement>('[data-vt-section-nav]');
}

function getLessonButton(lessonId: string) {
  return document.querySelector<HTMLButtonElement>(
    `.vt-sub[data-lesson-id="${lessonId}"], .vt-cat__flat-btn[data-lesson-id="${lessonId}"]`,
  );
}

function scrollSidebarToLesson(lessonId: string) {
  const activeBtn = getLessonButton(lessonId);
  const scrollTarget =
    activeBtn?.closest<HTMLElement>('.vt-sub-wrap') ??
    activeBtn?.closest<HTMLElement>('.vt-cat');
  const sidebarScroll = getSidebarScroll();
  if (!(scrollTarget instanceof HTMLElement) || !(sidebarScroll instanceof HTMLElement)) return;

  const scrollItemIntoView = () => {
    if (sidebarScroll.scrollHeight <= sidebarScroll.clientHeight) return;

    const padding = 20;
    const scrollRect = sidebarScroll.getBoundingClientRect();
    const itemRect = scrollTarget.getBoundingClientRect();
    let nextScrollTop = sidebarScroll.scrollTop;

    if (itemRect.top < scrollRect.top + padding) {
      nextScrollTop += itemRect.top - scrollRect.top - padding;
    } else if (itemRect.bottom > scrollRect.bottom - padding) {
      nextScrollTop += itemRect.bottom - scrollRect.bottom + padding;
    } else {
      return;
    }

    const maxTop = sidebarScroll.scrollHeight - sidebarScroll.clientHeight;
    sidebarScroll.scrollTop = Math.max(0, Math.min(nextScrollTop, maxTop));
  };

  scrollItemIntoView();
  requestAnimationFrame(scrollItemIntoView);
}

function updateSectionNav() {
  const sectionNav = getSectionNav();
  const prevBtn = document.querySelector<HTMLButtonElement>('[data-vt-prev]');
  const nextBtn = document.querySelector<HTMLButtonElement>('[data-vt-next]');

  if (!(sectionNav instanceof HTMLElement)) return;

  if (lessonOrder.length <= 1) {
    sectionNav.hidden = true;
    return;
  }

  sectionNav.hidden = false;

  const hasPrev = activeLessonIndex > 0;
  const hasNext = activeLessonIndex < lessonOrder.length - 1;

  if (prevBtn instanceof HTMLButtonElement) {
    prevBtn.hidden = !hasPrev;
    prevBtn.textContent = hasPrev
      ? `← ${findLesson(lessonOrder[activeLessonIndex - 1])?.lesson.title ?? 'Previous lesson'}`
      : '← Previous lesson';
  }

  if (nextBtn instanceof HTMLButtonElement) {
    nextBtn.hidden = !hasNext;
    nextBtn.textContent = hasNext
      ? `${findLesson(lessonOrder[activeLessonIndex + 1])?.lesson.title ?? 'Next lesson'} →`
      : 'Next lesson →';
  }
}

function expandCategoryForLesson(lessonId: string) {
  const activeBtn = getLessonButton(lessonId);
  const panel = activeBtn?.closest<HTMLElement>('.vt-cat__panel');
  if (panel?.hidden) setExpanded(panel, true);
}

function updateSidebarSelection(lessonId: string) {
  expandCategoryForLesson(lessonId);

  document.querySelectorAll('.vt-sub-wrap').forEach((el) => {
    el.classList.remove('vt-sub-wrap--active');
  });
  document.querySelectorAll('.vt-cat--flat').forEach((el) => {
    el.classList.remove('vt-cat--flat-active');
  });
  document.querySelectorAll('.vt-sub, .vt-cat__flat-btn').forEach((el) => {
    el.removeAttribute('aria-current');
  });

  const activeBtn = getLessonButton(lessonId);
  const activeWrap = activeBtn?.closest('.vt-sub-wrap');
  activeWrap?.classList.add('vt-sub-wrap--active');
  activeBtn?.closest('.vt-cat--flat')?.classList.add('vt-cat--flat-active');
  activeBtn?.setAttribute('aria-current', 'true');

  scrollSidebarToLesson(lessonId);
}

function updateLessonSections(index: number) {
  getLessonSections().forEach((section, sectionIndex) => {
    const isActive = sectionIndex === index;
    section.classList.toggle('vt-lesson--active', isActive);
    section.hidden = !isActive;
  });
}

function updatePlayerForLesson(lessonId: string) {
  const activeBtn = getLessonButton(lessonId);
  const match = activeBtn ? readLessonFromButton(activeBtn) : findLesson(lessonId);
  if (!match) return;

  const playerEl = document.querySelector<HTMLElement>('.vt-player');
  if (playerEl) renderPlayer(playerEl, match.lesson.title, match.lesson.videoUrl);
}

function showLesson(index: number) {
  if (index < 0 || index >= lessonOrder.length) return;

  activeLessonIndex = index;
  const lessonId = lessonOrder[index];
  updateLessonSections(index);
  updateSidebarSelection(lessonId);
  updatePlayerForLesson(lessonId);
  updateSectionNav();
}

function selectLesson(lessonId: string) {
  const index = lessonOrder.indexOf(lessonId);
  if (index === -1) return;
  showLesson(index);
}

function handlePageClick(event: Event) {
  const target = event.target;
  if (!(target instanceof Element)) return;

  const prevBtn = target.closest<HTMLButtonElement>('[data-vt-prev]');
  if (prevBtn && activeLessonIndex > 0) {
    showLesson(activeLessonIndex - 1);
    return;
  }

  const nextBtn = target.closest<HTMLButtonElement>('[data-vt-next]');
  if (nextBtn && activeLessonIndex < lessonOrder.length - 1) {
    showLesson(activeLessonIndex + 1);
    return;
  }

  const flatButton = target.closest<HTMLButtonElement>('.vt-cat__flat-btn');
  if (flatButton?.dataset.lessonId) {
    selectLesson(flatButton.dataset.lessonId);
    return;
  }

  const toggle = target.closest<HTMLButtonElement>('.vt-cat__toggle');
  if (toggle) {
    const panelId = toggle.getAttribute('aria-controls');
    if (!panelId) return;
    const panel = document.getElementById(panelId);
    if (!panel) return;
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    setExpanded(panel, !expanded);
    return;
  }

  const lessonButton = target.closest<HTMLButtonElement>('.vt-sub');
  if (lessonButton?.dataset.lessonId) {
    selectLesson(lessonButton.dataset.lessonId);
  }
}

export type VideoTutorialClientCategory = {
  id: string;
  title: string;
  lessons: Array<{
    id: string;
    title: string;
    duration: string;
    description: string[];
    videoUrl: string | null;
    categoryTitle: string;
  }>;
};

export function initVideoTutorials(
  defaultLessonId: string,
  categories: VideoTutorialClientCategory[],
  options: { defaultLessonIndex?: number; lessonOrder?: string[] } = {},
) {
  categoriesCache = categories;
  lessonOrder =
    options.lessonOrder ??
    categories.flatMap((category) => category.lessons.map((lesson) => lesson.id));

  const root = document.getElementById('vt-page');
  if (!root) return;

  const parsedIndex = Number(root.dataset.defaultLessonIndex);
  activeLessonIndex =
    options.defaultLessonIndex ??
    (Number.isFinite(parsedIndex) && parsedIndex >= 0
      ? parsedIndex
      : Math.max(0, lessonOrder.indexOf(defaultLessonId)));

  if (root.dataset.bound !== 'true') {
    root.addEventListener('click', handlePageClick);
    root.dataset.bound = 'true';
  }

  const initialLessonId = lessonOrder[activeLessonIndex] ?? defaultLessonId;
  if (initialLessonId) {
    showLesson(activeLessonIndex);
  }
}
