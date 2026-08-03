import type { HelpGuide } from './blog-types';
import type { FaqItem } from '../lib/seo/schema';

export const helpGuides: HelpGuide[] = [
  {
    slug: 'set-up-your-workspace',
    topic: 'Getting Started',
    title: 'How to Set Up Your Pixeldesk Workspace',
    description:
      'Create your Pixeldesk workspace, configure company settings, and get your team ready to manage projects in minutes.',
    steps: [
      {
        name: 'Create your workspace',
        text: 'Sign up at pixeldesk.com and enter your company name, industry, and timezone. Pixeldesk creates a dedicated workspace URL you can share with your team.',
      },
      {
        name: 'Configure workspace settings',
        text: 'Open Settings → Workspace and set your default currency, working hours, and fiscal year. These values apply to timesheets, budgets, and reports across all projects.',
      },
      {
        name: 'Add your first project',
        text: 'Click New Project from the dashboard, name the project, assign a client, and choose a start date. Add a brief description so team members understand the scope at a glance.',
      },
      {
        name: 'Customize your dashboard',
        text: 'Pin the widgets you use most—active sprints, pending approvals, or upcoming deadlines—so your home screen shows what matters on day one.',
      },
      {
        name: 'Verify email and security',
        text: 'Confirm your account email and enable two-factor authentication under Settings → Security to protect client data and billing information.',
      },
    ],
    faqs: [
      {
        q: 'Can I rename my workspace later?',
        a: 'Yes. Go to Settings → Workspace and update your company name or logo at any time. Your workspace URL stays the same.',
      },
      {
        q: 'How many projects can I create on the free plan?',
        a: 'The free plan includes up to three active projects. Upgrade to Pro for unlimited projects and client portal access.',
      },
      {
        q: 'Do I need to invite team members before creating projects?',
        a: 'No. You can create projects first and invite teammates when you are ready. Unassigned tasks can be claimed once members join.',
      },
    ] satisfies FaqItem[],
  },
  {
    slug: 'create-your-first-sprint',
    topic: 'Sprint Planning',
    title: 'How to Create a Sprint in Pixeldesk',
    description:
      'Plan your first sprint, populate the backlog, assign story points, and start tracking velocity in Pixeldesk.',
    steps: [
      {
        name: 'Open Sprint Planning',
        text: 'Navigate to your project and select the Sprint Planning tab. Click Create Sprint and give it a name, start date, and end date (typically one or two weeks).',
      },
      {
        name: 'Build your backlog',
        text: 'Add tasks to the backlog with titles, descriptions, and priority labels. Drag items from the backlog column into the sprint column to commit them to the current iteration.',
      },
      {
        name: 'Estimate with story points',
        text: 'Assign story points to each task using the points field on the task card. Use your team\'s agreed scale (e.g., 1, 2, 3, 5, 8) so velocity tracking stays consistent.',
      },
      {
        name: 'Assign owners and start the sprint',
        text: 'Assign each task to a team member, review total points against your velocity target, then click Start Sprint. The board switches to active mode and locks scope until the sprint ends.',
      },
      {
        name: 'Review velocity after the sprint',
        text: 'When the sprint ends, open the Velocity report under Analytics to see completed points versus planned. Use this data to calibrate the next sprint\'s capacity.',
      },
    ],
    faqs: [
      {
        q: 'Can I add tasks to an active sprint?',
        a: 'Yes. Drag new items from the backlog into the active sprint, but note that mid-sprint additions affect velocity comparisons. Consider logging scope changes in the sprint notes.',
      },
      {
        q: 'What is the difference between a backlog and a sprint?',
        a: 'The backlog holds all planned work for the project. A sprint is a time-boxed subset of backlog items your team commits to completing within the sprint dates.',
      },
      {
        q: 'How do I carry unfinished tasks to the next sprint?',
        a: 'At sprint close, Pixeldesk prompts you to move incomplete tasks back to the backlog or roll them into the next sprint automatically.',
      },
    ] satisfies FaqItem[],
  },
  {
    slug: 'set-up-client-portal',
    topic: 'Client Portal',
    title: 'How to Set Up a Client Portal',
    description:
      'Invite clients to a branded portal, control what they can see, and keep project updates transparent without extra email threads.',
    steps: [
      {
        name: 'Enable the client portal for a project',
        text: 'Open the project settings and toggle Client Portal on. Choose which modules clients can access—tasks, files, timesheets, or budget summaries.',
      },
      {
        name: 'Invite your client',
        text: 'Click Invite Client, enter their email address, and select their role (Viewer or Approver). They receive an email with a secure link to their portal dashboard.',
      },
      {
        name: 'Configure visibility settings',
        text: 'Under Portal Settings, decide whether clients see internal notes, hourly rates, or full budget breakdowns. Hide sensitive fields before sending the invitation.',
      },
      {
        name: 'Share project updates',
        text: 'Mark tasks as client-visible and attach deliverables directly to task cards. Clients see progress in real time without needing a Pixeldesk account beyond their portal login.',
      },
      {
        name: 'Set up approval workflows',
        text: 'Enable timesheet or milestone approvals so clients can sign off on work from the portal. Approvers receive notifications when items need their review.',
      },
    ],
    faqs: [
      {
        q: 'Do clients need a paid Pixeldesk seat?',
        a: 'No. Client portal access is included with Pro and Enterprise plans. Clients log in with their own credentials at no extra cost.',
      },
      {
        q: 'Can I customize the portal branding?',
        a: 'Yes. Upload your agency logo and set accent colors under Settings → Branding. Clients see your brand, not Pixeldesk\'s, when they log in.',
      },
      {
        q: 'Can clients comment on tasks?',
        a: 'Clients with Approver or Collaborator roles can leave comments on visible tasks. Viewers can read updates but cannot post comments.',
      },
    ] satisfies FaqItem[],
  },
  {
    slug: 'log-and-submit-timesheet',
    topic: 'Timesheets',
    title: 'How to Log and Submit a Timesheet',
    description:
      'Track billable and non-billable hours, attach time entries to projects, and submit timesheets for manager approval.',
    steps: [
      {
        name: 'Open the Timesheets module',
        text: 'Click Timesheets in the sidebar to view your weekly grid. Each row represents a project; each column is a day of the current week.',
      },
      {
        name: 'Log time against a project',
        text: 'Click a cell for the project and date, enter hours in decimal or HH:MM format, and add a brief note describing the work performed. Repeat for each project you worked on that day.',
      },
      {
        name: 'Mark entries as billable or non-billable',
        text: 'Toggle the billable flag on each entry before saving. Billable hours appear on client invoices; non-billable hours are tracked internally for capacity planning.',
      },
      {
        name: 'Review your weekly total',
        text: 'Check the footer row for your weekly hour total and compare it against your expected capacity. Fix any gaps or duplicates before submitting.',
      },
      {
        name: 'Submit for approval',
        text: 'Click Submit Timesheet when the week is complete. Your manager receives a notification and can approve, reject, or request changes directly from the approval queue.',
      },
    ],
    faqs: [
      {
        q: 'Can I edit a submitted timesheet?',
        a: 'If your manager has not yet approved it, click Recall to unlock the sheet for edits. Once approved, contact your admin to reopen the entry.',
      },
      {
        q: 'How do I log time on a mobile device?',
        a: 'Open Pixeldesk in your mobile browser and navigate to Timesheets. The grid is responsive, and you can log entries from any device with internet access.',
      },
      {
        q: 'Can I export timesheets for billing?',
        a: 'Yes. Managers can export approved timesheets as CSV or PDF from Reports → Timesheets, filtered by project, client, or date range.',
      },
    ] satisfies FaqItem[],
  },
  {
    slug: 'post-team-notice',
    topic: 'Notice Board',
    title: 'How to Post a Notice on the Notice Board',
    description:
      'Publish team and client announcements, pin urgent updates, and keep everyone aligned without cluttering chat channels.',
    steps: [
      {
        name: 'Open the Notice Board',
        text: 'Navigate to Notice Board from the main sidebar. You will see pinned notices at the top and a chronological feed of recent announcements below.',
      },
      {
        name: 'Create a new notice',
        text: 'Click New Notice, enter a clear headline, and write the body using the rich-text editor. Add links, bullet lists, or bold text to highlight key details.',
      },
      {
        name: 'Choose the audience',
        text: 'Select whether the notice is visible to the whole workspace, a specific project team, or client portal users. Audience controls prevent internal updates from reaching clients.',
      },
      {
        name: 'Set priority and pin if needed',
        text: 'Mark urgent notices with the High Priority flag so they appear with a badge. Pin critical announcements to keep them at the top of the board until you unpin them.',
      },
      {
        name: 'Publish and notify recipients',
        text: 'Click Publish to post the notice immediately. Team members receive an in-app notification and, if enabled, an email digest with the notice content.',
      },
    ],
    faqs: [
      {
        q: 'Who can post notices?',
        a: 'Workspace admins and project managers can create notices by default. Admins can grant posting permissions to other roles under Settings → Permissions.',
      },
      {
        q: 'Can I schedule a notice for later?',
        a: 'Yes. Set a publish date and time when creating the notice. It stays in draft until the scheduled moment, then goes live automatically.',
      },
      {
        q: 'How do I archive old notices?',
        a: 'Click the archive icon on any notice to move it out of the active feed. Archived notices remain searchable from the Notice Board history tab.',
      },
    ] satisfies FaqItem[],
  },
  {
    slug: 'invite-team-members',
    topic: 'People Management',
    title: 'How to Invite Team Members and Manage Leave',
    description:
      'Add teammates to your workspace, assign roles, and configure leave requests and holiday calendars in one place.',
    steps: [
      {
        name: 'Invite a team member',
        text: 'Go to People → Team and click Invite Member. Enter their work email, choose a role (Admin, Manager, or Member), and send the invitation.',
      },
      {
        name: 'Assign roles and project access',
        text: 'After a member accepts, open their profile to assign project-level permissions. Managers can approve timesheets; Members can log time and update assigned tasks.',
      },
      {
        name: 'Configure the holiday calendar',
        text: 'Under People → Calendar, add company-wide holidays and regional observances. These dates block leave requests automatically and appear on team availability views.',
      },
      {
        name: 'Submit or approve leave requests',
        text: 'Team members submit leave from their profile by selecting dates and leave type. Managers review pending requests in People → Leave and approve or decline with a note.',
      },
      {
        name: 'Check team availability',
        text: 'Open the Availability dashboard to see who is out today, upcoming birthdays, and remaining leave balances. Use this view when planning sprints or client deadlines.',
      },
    ],
    faqs: [
      {
        q: 'How many team members can I invite?',
        a: 'The number of seats depends on your plan. Each active member counts as one seat. Deactivated members free up a seat immediately.',
      },
      {
        q: 'Can members belong to multiple projects?',
        a: 'Yes. Assign members to as many projects as needed from their profile or from each project\'s team settings tab.',
      },
      {
        q: 'Do leave requests sync with the sprint board?',
        a: 'Approved leave marks the member as unavailable on the sprint board and capacity planner, so you can account for reduced velocity during planning.',
      },
    ] satisfies FaqItem[],
  },
];

export function getHelpGuide(slug: string): HelpGuide | undefined {
  return helpGuides.find((guide) => guide.slug === slug);
}

export const helpGuideSlugs: string[] = helpGuides.map((guide) => guide.slug);

export const topicGuideMap: Record<string, string> = {
  'Getting Started': 'set-up-your-workspace',
  'Sprint Planning': 'create-your-first-sprint',
  'Client Portal': 'set-up-client-portal',
  Timesheets: 'log-and-submit-timesheet',
  'Notice Board': 'post-team-notice',
  'People Management': 'invite-team-members',
  'Projects & Tasks': 'set-up-your-workspace',
  'Team Chat': 'invite-team-members',
  'Account & Billing': 'set-up-your-workspace',
};
