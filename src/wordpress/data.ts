export type OrganizationCardContent = {
  id: string;
  short: string;
  tag: string;
  title: string;
  description: string;
  contact: string;
  meeting: string;
  status: string;
  tags: string[];
};

export type SearchResultContent = {
  title: string;
  description: string;
  eyebrow: string;
  meta: string;
  icon: string;
  keywords: string;
};

export const organizationCards: OrganizationCardContent[] = [
  {
    id: 'css',
    short: 'CS',
    tag: 'Tech & Innovation',
    title: 'Computer Science Society',
    description: 'Hack nights, mentorship, and workshops for student builders.',
    contact: 'css@unbc.ca',
    meeting: 'Tuesdays · Teaching Lab 10',
    status: 'Active this semester',
    tags: ['all', 'tech', 'clubs'],
  },
  {
    id: 'pride',
    short: 'PR',
    tag: 'Advocacy',
    title: 'Pride Centre Collective',
    description: 'Peer-led drop-ins focused on queer student support and programming.',
    contact: 'pride@unbc.ca',
    meeting: 'Thursdays · NUSC 235',
    status: 'Mentors needed',
    tags: ['all', 'advocacy', 'clubs'],
  },
  {
    id: 'outdoor',
    short: 'OC',
    tag: 'Outdoors',
    title: 'Northern Outdoor Club',
    description: 'Weekend hikes, avalanche training, and equipment lending.',
    contact: 'outdoor@unbc.ca',
    meeting: 'Bi-weekly · Birch 349',
    status: 'Trips filling fast',
    tags: ['all', 'outdoors', 'clubs'],
  },
  {
    id: 'wellness',
    short: 'HE',
    tag: 'Health',
    title: 'Campus Wellness Collective',
    description: 'Runs peer-support training, mindfulness labs, and care referrals.',
    contact: 'wellness@unbc.ca',
    meeting: 'Mon & Wed · Wellness Studio',
    status: 'Volunteers welcome',
    tags: ['all', 'services', 'wellness'],
  },
  {
    id: 'media',
    short: 'MJ',
    tag: 'Media',
    title: 'Multimedia Journalism Lab',
    description: 'Loaner gear, editing mentorship, and newsroom onboarding.',
    contact: 'editor@ote.ca',
    meeting: 'Fridays · Media Studio',
    status: 'Orientation next week',
    tags: ['all', 'media', 'academics'],
  },
  {
    id: 'su',
    short: 'SU',
    tag: 'Governance',
    title: 'Student Union',
    description: 'Advocacy, campaigns, and grants for UNBC students and clubs.',
    contact: 'hello@unbc.ca',
    meeting: 'Wednesdays · Conference C',
    status: 'AGM · Apr 22',
    tags: ['all', 'governance', 'services'],
  },
];

export const searchResults: SearchResultContent[] = [
  {
    title: 'Student Clubs Directory',
    description: 'Browse 32 active clubs with contacts, meeting times, and perks.',
    eyebrow: 'Directory',
    meta: 'Updated 2 days ago',
    icon: '🗂️',
    keywords: 'clubs directory organizations get involved search',
  },
  {
    title: 'Calendar · Week of April 21',
    description: 'UNBC events aggregated from Campus Manager and OTE submissions.',
    eyebrow: 'Events',
    meta: '13 events this week',
    icon: '📅',
    keywords: 'calendar events schedule music athletics',
  },
  {
    title: 'How to pitch Over The Edge',
    description: 'Submission process, style guide, and payment tiers in one place.',
    eyebrow: 'Guides',
    meta: '5 min read',
    icon: '📝',
    keywords: 'submission guide payment tier writing policy',
  },
  {
    title: 'Staff & Contributors',
    description: 'Meet the current editorial board, staff writers, and mentors.',
    eyebrow: 'People',
    meta: 'Updated monthly',
    icon: '👥',
    keywords: 'staff profiles contributors board members',
  },
];

export const trendingQueries = ['clubs fair', 'calendar', 'payment tiers', 'staff profiles'];
export const recentSearches = ['Confessions form', 'UNBC Senate recap', 'Campus map', 'Transit detours'];
