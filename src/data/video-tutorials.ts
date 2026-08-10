import type {
  PublicVideoTutorialCategory,
  PublicVideoTutorialLesson,
  PublicVideoTutorialsPayload,
} from '../lib/api/video-tutorials.api';

export type VideoTutorialLesson = {
  id: string;
  title: string;
  duration: string;
  description: string[];
  videoUrl: string | null;
  categoryTitle: string;
};

export type VideoTutorialCategory = {
  id: string;
  title: string;
  durationLabel?: string;
  lessons: VideoTutorialLesson[];
  defaultOpen?: boolean;
};

const DUMMY_EMBED_VIDEO_IDS = [
  'aqz-KE-bpKQ',
  'eRsGyueVLQ8',
  '416TW8Y77P8',
  'jNQXAC9IVRw',
  '394BHcFjB2Q',
  'M7lc1UVf-VE',
  'LXb3EKWsInQ',
  '360nK1L-u-s',
  'By9wCB9IZpM',
  'ScMzIvxBSi4',
  'kJQP7kiw5Fk',
  'dQw4w9WgXcQ',
  '9bZkp7q19f0',
  'OPf0YbXqDm0',
  'CevxZvSJLk8',
  'hT_nvWreIhg',
  'RgKAF43YWkA',
  'nfWlot6h_JM',
  'YQHsXMglC9A',
  'fJ9rUzIMcZQ',
  'JGwWNGJdvx8',
  '2Vv-BfVoq4g',
  'lp-EO170I7A',
  '60ItHLz5WEA',
  'kffacxfA7G4',
] as const;

let fallbackVideoIndex = 0;

const yt = (id: string) =>
  `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1&playsinline=1`;

function nextFallbackVideo() {
  const id = DUMMY_EMBED_VIDEO_IDS[fallbackVideoIndex % DUMMY_EMBED_VIDEO_IDS.length];
  fallbackVideoIndex += 1;
  return yt(id);
}

function lesson(
  id: string,
  categoryTitle: string,
  title: string,
  duration: string,
  description: string[],
  videoUrl?: string,
): VideoTutorialLesson {
  return {
    id,
    categoryTitle,
    title,
    duration,
    videoUrl: videoUrl ?? nextFallbackVideo(),
    description,
  };
}

/** Static fallback when API is unavailable (mirrors CMS seed content). */
export const fallbackVideoTutorialCategories: VideoTutorialCategory[] = [
  {
    id: 'fallback-1',
    title: 'Getting Started',
    defaultOpen: true,
    lessons: [
      lesson('fallback-1-1', 'Getting Started', 'Welcome to Pixeldesk', '3:10 min', [
        'A quick tour of the Pixeldesk workspace: navigation, notifications, and where to find projects, clients, and your team directory.',
      ]),
      lesson('fallback-1-2', 'Getting Started', 'Set up your profile', '2:45 min', [
        'Upload your photo, set your timezone, and configure notification preferences.',
      ]),
      lesson('fallback-1-3', 'Getting Started', 'Join your first workspace', '4:00 min', [
        'Accept an invite, complete onboarding, and land on your dashboard.',
      ]),
    ],
  },
  {
    id: 'fallback-2',
    title: 'Workspace Overview',
    durationLabel: '5 min overview',
    lessons: [
      lesson('fallback-2-1', 'Workspace Overview', 'Workspace overview', '5:00 min', [
        'See how Pixeldesk connects projects, clients, timesheets, and leave in one workspace.',
      ]),
    ],
  },
  {
    id: 'fallback-3',
    title: 'Projects & Task Board',
    lessons: [
      lesson('fallback-3-1', 'Projects & Task Board', 'Create your first project', '4:20 min', [
        'Learn how to create a project in Pixeldesk, set the client, timeline, and default board columns.',
      ]),
      lesson('fallback-3-2', 'Projects & Task Board', 'Using the Kanban task board', '6:15 min', [
        'Walk through the Kanban board: customize status columns, drag tasks between stages, and filter by assignee.',
      ]),
      lesson('fallback-3-3', 'Projects & Task Board', 'Assign tasks and due dates', '3:45 min', [
        'Assign owners, set due dates, and add checklists so everyone knows what to do next.',
      ]),
      lesson('fallback-3-4', 'Projects & Task Board', 'Task comments and history', '4:00 min', [
        'Keep context on every task with comments, @mentions, and an automatic activity history.',
      ]),
      lesson('fallback-3-5', 'Projects & Task Board', 'Project milestones and status', '5:30 min', [
        'Track milestones, update project health, and share progress with stakeholders.',
      ]),
    ],
  },
  {
    id: 'fallback-4',
    title: 'Client Portal',
    lessons: [
      lesson('fallback-4-1', 'Client Portal', 'Add a new client', '3:30 min', [
        'Create a client record with contacts, billing notes, and portal settings.',
      ]),
      lesson('fallback-4-2', 'Client Portal', 'Invite clients to the portal', '4:10 min', [
        'Send secure portal invites so clients log in without access to your internal workspace.',
      ]),
      lesson('fallback-4-3', 'Client Portal', 'Share deliverables and milestones', '5:00 min', [
        'Choose exactly what clients see: milestones, files, and status updates.',
      ]),
      lesson('fallback-4-4', 'Client Portal', 'Collect client feedback', '4:45 min', [
        'Enable feedback on deliverables so clients rate and comment in the portal.',
      ]),
      lesson('fallback-4-5', 'Client Portal', 'Portal visibility settings', '3:20 min', [
        'Fine-tune what each client role can view on a per-project basis.',
      ]),
      lesson('fallback-4-6', 'Client Portal', 'Client email notifications', '3:55 min', [
        'Configure when clients receive email about portal updates and feedback requests.',
      ]),
      lesson('fallback-4-7', 'Client Portal', 'Client statistics and QBR prep', '4:30 min', [
        'Review hours logged, open tasks, and delivery health per client.',
      ]),
    ],
  },
  {
    id: 'fallback-5',
    title: 'Timesheets',
    durationLabel: '6 min overview',
    lessons: [
      lesson('fallback-5-1', 'Timesheets', 'Timesheets overview', '6:00 min', [
        'Learn how to log time against projects, submit weekly timesheets, and review entries as a manager.',
      ]),
      lesson('fallback-5-2', 'Timesheets', 'Log time on tasks', '3:50 min', [
        'Start a timer or add manual entries linked to projects and activities.',
      ]),
      lesson('fallback-5-3', 'Timesheets', 'Approve team timesheets', '4:15 min', [
        'Managers review submitted hours, reject incomplete entries, and export approved time.',
      ]),
    ],
  },
  {
    id: 'fallback-6',
    title: 'Leave Management',
    lessons: [
      lesson('fallback-6-1', 'Leave Management', 'Configure leave types and policies', '4:05 min', [
        'Set up leave types with accrual rules and assign policies by employee category.',
      ]),
      lesson('fallback-6-2', 'Leave Management', 'Employee leave balances', '3:40 min', [
        'Employees see remaining balance before they request time off.',
      ]),
      lesson('fallback-6-3', 'Leave Management', 'Submit a leave request', '3:15 min', [
        'Pick dates, leave type, and submit for manager approval from My Leaves.',
      ]),
      lesson('fallback-6-4', 'Leave Management', 'Approve or reject leave', '3:50 min', [
        'Managers review requests against team capacity using the leave tracker.',
      ]),
      lesson('fallback-6-5', 'Leave Management', 'Leave tracker for managers', '5:10 min', [
        'See upcoming and past leave by person, team, or department.',
      ]),
    ],
  },
  {
    id: 'fallback-7',
    title: 'Team & Permissions',
    lessons: [
      lesson('fallback-7-1', 'Team & Permissions', 'Invite team members', '3:25 min', [
        'Invite colleagues with department, designation, and role.',
      ]),
      lesson('fallback-7-2', 'Team & Permissions', 'Roles and permissions', '5:45 min', [
        'Understand default roles and customize access to sensitive modules.',
      ]),
      lesson('fallback-7-3', 'Team & Permissions', 'Departments and designations', '4:15 min', [
        'Structure your org chart for reports, leave policies, and directory search.',
      ]),
    ],
  },
  {
    id: 'fallback-8',
    title: 'Dashboard & Widgets',
    durationLabel: '4 min overview',
    lessons: [
      lesson('fallback-8-1', 'Dashboard & Widgets', 'Dashboard & widgets overview', '4:00 min', [
        'Customize your home dashboard with widgets for tasks, leave, client activity, and project health.',
      ]),
      lesson('fallback-8-2', 'Dashboard & Widgets', 'Pin and rearrange widgets', '3:20 min', [
        'Drag widgets into place, resize panels, and save a layout that matches your role.',
      ]),
    ],
  },
];

export const fallbackDefaultVideoLessonId = 'fallback-1-1';

export function buildVideoTutorialsViewModel(payload: PublicVideoTutorialsPayload): {
  categories: VideoTutorialCategory[];
  defaultLessonId: string;
} {
  const defaultLessonId =
    payload.defaultLessonId ??
    payload.categories.flatMap((c) => c.lessons)[0]?.id ??
    fallbackDefaultVideoLessonId;

  const categories: VideoTutorialCategory[] = payload.categories.map((category) => {
    const lessons = category.lessons.map((lesson) => mapLesson(category, lesson));
    return {
      id: category.id,
      title: category.title,
      durationLabel: category.durationLabel ?? undefined,
      defaultOpen: lessons.some((lesson) => lesson.id === defaultLessonId),
      lessons,
    };
  });

  return { categories, defaultLessonId };
}

function mapLesson(
  category: PublicVideoTutorialCategory,
  lesson: PublicVideoTutorialLesson,
): VideoTutorialLesson {
  return {
    id: lesson.id,
    title: lesson.title,
    duration: lesson.duration,
    description: lesson.description,
    videoUrl: lesson.videoUrl,
    categoryTitle: category.title,
  };
}

export function findVideoLesson(
  categories: VideoTutorialCategory[],
  id: string,
): { category: VideoTutorialCategory; lesson: VideoTutorialLesson } | null {
  for (const category of categories) {
    const lesson = category.lessons.find((item) => item.id === id);
    if (lesson) return { category, lesson };
  }
  return null;
}
