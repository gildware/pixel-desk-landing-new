import type { BlogPost, BlogSection } from './blog-types';
import type { FaqItem } from '../lib/seo/schema';

function defaultFaqs(topic: string): FaqItem[] {
  return [
    {
      q: `How does Pixeldesk support ${topic}?`,
      a: 'Pixeldesk connects delivery, people, and client visibility in one workspace — with client portals, sprints, timesheets, budget tracking, and project-linked chat. See /features for the full feature list.',
    },
    {
      q: 'Is there a free plan to try this workflow?',
      a: 'Yes. Pixeldesk Starter is free for up to 5 users and 3 projects. Growth adds client portal, sprints, and budget tools — details on /pricing.',
    },
    {
      q: 'Where can I get step-by-step setup help?',
      a: 'Visit the Help Center at /resources for guides on workspace setup, client portals, sprints, and timesheets.',
    },
  ];
}

function sectionsFromExcerpt(excerpt: string, title: string): BlogSection[] {
  return [
    { heading: 'Overview', paragraphs: [excerpt] },
    {
      heading: 'Why it matters',
      paragraphs: [
        `For project managers, team leads, and agency owners, getting "${title.split('—')[0].trim()}" right shapes how clients perceive progress, how teams estimate capacity, and how confidently you commit to deadlines.`,
      ],
    },
    {
      heading: 'Put it into practice with Pixeldesk',
      paragraphs: [
        'Audit how your team handles this today — where information lives, who owns updates, and what breaks when workload increases. Then connect progress, people, and client visibility in one workspace instead of spreadsheets and inbox threads.',
        'Explore Pixeldesk on /features or compare plans on /pricing to see client portals, sprint planning, timesheets, and budget tracking in one place.',
      ],
    },
  ];
}

function post(
  slug: string,
  category: string,
  title: string,
  excerpt: string,
  targetKeyword: string,
  readMoreVariant: 'navy' | 'grey',
  extras?: Partial<Pick<BlogPost, 'titleHtml' | 'faqs' | 'sections'>>
): BlogPost {
  return {
    slug,
    category,
    title,
    excerpt,
    date: 'August 1, 2026',
    dateIso: '2026-08-01',
    targetKeyword,
    readMoreVariant,
    sections: extras?.sections ?? sectionsFromExcerpt(excerpt, title),
    faqs: extras?.faqs ?? defaultFaqs(targetKeyword),
    ...extras,
  };
}

export const blogPosts: BlogPost[] = [
  post(
    'client-portal-project-management',
    'Client Transparency',
    'What is a Client Portal in Project Management — and Why Your Agency Needs One',
    'A client portal gives clients a dedicated, branded view of project progress without exposing your internal workspace — the highest-leverage transparency upgrade most agencies skip.',
    'client portal project management',
    'navy'
  ),
  post(
    'sprint-planning-101',
    'Sprint Planning',
    'Sprint Planning 101: How to Break Any Project into Focused Deliverables',
    'Sprint planning turns overwhelming projects into focused cycles your team can actually finish — even if you have never written a user story.',
    'sprint planning guide for non-technical teams',
    'grey'
  ),
  post(
    'track-project-budgets-without-spreadsheet',
    'Client Billing',
    'How to Track Project Budgets Without a Spreadsheet',
    'Spreadsheet budgets fail silently. Connecting logged time, planned effort, and spend alerts in your PM tool is how teams catch overruns before clients do.',
    'project budget tracking software',
    'navy'
  ),
  post(
    'jira-vs-asana-vs-monday-vs-pixeldesk-2026',
    'Industry Insights',
    'Jira vs Asana vs Monday.com vs Pixeldesk: Which Is Right for Your Team in 2026?',
    'The best project management tool depends on whether you need dev-centric issue tracking, general work management, or a client-facing delivery workspace.',
    'best project management software comparison 2026',
    'grey'
  ),
  post(
    'client-real-time-project-visibility',
    'Client Transparency',
    'How to Give Clients Real-Time Project Visibility Without Giving Them Access to Everything',
    "Most agencies either over-share (clients in your Slack) or under-share (weekly PDFs nobody reads). There's a smarter middle ground — and it starts with a properly configured client portal.",
    'client transparency project management',
    'navy',
    {
      titleHtml:
        'How to Give Clients <br />Real-Time Project Visibility Without Giving Them Access to Everything',
    }
  ),
  post(
    'hidden-cost-team-leave-deadlines',
    'Team & People',
    'The Hidden Cost of Not Tracking Team Leave Before Setting Project Deadlines',
    "Managers consistently underestimate how much leave, public holidays, and part-time schedules compress actual working days. Here's the maths — and what to do about it before you commit to a client deadline.",
    'leave management software for project teams',
    'grey',
  ),
  post(
    'it-projects-exceed-budget-timesheets',
    'Project Management',
    'Why 75% of IT Projects Exceed Budget — and the Timesheet Habit That Prevents It',
    "Budget overruns are rarely one big decision gone wrong. They're dozens of small hours that didn't get logged, didn't get reviewed, and didn't trigger an alert until it was too late to course-correct.",
    'project budget tracking software',
    'navy',
  ),
  post(
    'timesheet-problem-hours-never-logged',
    'Productivity Tips',
    'The Timesheet Problem Nobody Talks About: 40% of Hours Are Never Logged Accurately',
    "When team members fill timesheets from memory at the end of the week, the data is never right. Billing becomes guesswork, utilisation reporting becomes fiction, and clients end up funding hours that weren't tracked. Here's how to fix it structurally.",
    'timesheet management software for agencies',
    'grey',
  ),
  post(
    'client-portals-win-retainers',
    'Industry Insights',
    'How Digital Agencies Are Using Client Portals to Win Retainers — Not Just Manage Projects',
    "The agencies winning the longest retainers in 2026 aren't just delivering good work — they're making the client feel informed at every step. A live client portal isn't a feature. It's a retention strategy.",
    'client portal project management',
    'grey',
  ),
  post(
    'agile-non-technical-teams-sprints',
    'Sprint Planning',
    "Agile Isn't Just for Developers: How Non-Technical Teams Are Running Sprints in 2026",
    "Marketing teams. Design studios. Consulting firms. They're all running sprint cycles now — and getting measurably better results than teams that plan in quarterly blobs. Here's how to apply the framework without the jargon.",
    'agile project management for non-developers',
    'navy',
  ),
  post(
    'notice-boards-vs-email-updates',
    'Project Management',
    'Notice Boards vs Email Updates: Which Actually Keeps Your Team Informed?',
    "The average professional receives 121 emails a day. Critical project updates buried in that inbox don't get read — they get skimmed or missed entirely. There's a better way to keep teams and clients informed without adding to the noise.",
    'notice board project management tool',
    'grey',
  ),
  post(
    'client-feedback-during-project',
    'Client Transparency',
    'Why Collecting Client Feedback Once at Project End Is a Mistake — and What to Do Instead',
    'End-of-project surveys capture how a client feels on delivery day. They miss the issues that built up during Week 3, the miscommunication in Sprint 2, and the quiet frustration that nearly ended the relationship in Month 4.',
    'client transparency project management',
    'grey',
  ),
  post(
    'team-chat-pm-tool-same-app',
    'Team & People',
    'Why Your Team Chat and Your Project Management Tool Should Be the Same App',
    "When conversations live in Slack and tasks live in a PM tool, context gets lost every time someone switches. Decisions made in chat aren't visible beside the work they affect — and the cost is higher than most teams realise.",
    'team communication in project management',
    'navy',
  ),
  post(
    'project-management-design-studios',
    'Industry Insights',
    "Project Management for Design Studios: What Works, What Doesn't, and What's Missing",
    "Design work is non-linear, feedback-heavy, and highly dependent on client responsiveness. Most PM tools were built for software teams. Here's what design studios actually need — and how to build a workflow that respects the creative process.",
    'project management for design studios',
    'grey',
  ),
  post(
    'dashboard-widget-budget-burn-rate',
    'Productivity Tips',
    "The One Dashboard Widget Every Project Manager Should Have — and Why Most Don't Know About It",
    "Budget burn rate against timeline progress sounds like a finance tool. Used correctly, it's the earliest possible warning system for a project that's heading off course — weeks before any deadline is actually missed.",
    'project budget tracking software',
    'navy',
  ),
  post(
    'spreadsheet-to-system-project-management',
    'Project Management',
    'From Spreadsheet to System: What Happens When Teams Stop Using Excel to Manage Projects',
    "89% of teams still use multiple disconnected tools — often with Excel at the centre. Here's a realistic, step-by-step account of what actually changes when a team makes the switch to a connected project management workspace.",
    'project management software',
    'grey',
  ),
];

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((entry) => entry.slug === slug);
}

export function getRelatedBlogPosts(current: BlogPost, limit = 3): BlogPost[] {
  return blogPosts
    .filter((entry) => entry.category === current.category && entry.slug !== current.slug)
    .slice(0, limit);
}

export function getMustReadBlogPosts(current: BlogPost, limit = 3): BlogPost[] {
  return blogPosts
    .filter((entry) => entry.readMoreVariant === 'navy' && entry.slug !== current.slug)
    .slice(0, limit);
}

function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

export function sectionAnchorId(heading: string): string {
  return slugifyHeading(heading);
}
