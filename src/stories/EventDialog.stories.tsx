import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { EventDialogCard } from '@/components/event-dialog-card';
import type { Event, EventMetadata } from '@/types';

// Sample event data
const sampleEvent: Event = {
  id: '1',
  title: 'Campus Movie Night: The Greatest Showman',
  description: 'Join us for a magical evening under the stars! We\'re screening The Greatest Showman, a spectacular musical drama that celebrates the birth of show business and tells of a visionary who rose from nothing to create a spectacle that became a worldwide sensation. Free popcorn and drinks will be provided. Bring your blankets and friends for an unforgettable night of entertainment!',
  startDate: new Date('2025-11-15T19:00:00'),
  endDate: new Date('2025-11-15T22:00:00'),
};

const sampleMetadata: Record<string, EventMetadata> = {
  '1': {
    location: 'Main Campus Quad',
    organization: 'Student Union',
    category: 'clubs',
    cost: 'Free',
    registrationRequired: false,
    website: 'https://example.com/movie-night',
  },
};

const meta: Meta<typeof EventDialogCard> = {
  title: 'UNBC/Calendar/EventDialog',
  component: EventDialogCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof EventDialogCard>;

export const Default: Story = {
  args: {
    event: sampleEvent,
    eventMetadata: sampleMetadata,
    showCost: true,
  },
};

export const WithoutCost: Story = {
  args: {
    event: sampleEvent,
    eventMetadata: sampleMetadata,
    showCost: false,
  },
};

export const ShortDescription: Story = {
  args: {
    event: {
      ...sampleEvent,
      title: 'Quick Coffee Chat',
      description: 'Join us for a casual coffee meetup!',
    },
    eventMetadata: {
      '1': {
        location: 'Campus Coffee Shop',
        organization: 'Career Services',
        category: 'unbc',
        cost: 'Free coffee provided',
        registrationRequired: true,
        website: 'https://example.com/coffee-chat',
      },
    },
    showCost: true,
  },
};

export const SportsEvent: Story = {
  args: {
    event: {
      ...sampleEvent,
      title: 'Intramural Basketball Tournament',
      description: 'Annual basketball tournament featuring teams from across campus. Come support your friends and classmates as they compete for the championship trophy. All skill levels welcome to participate or spectate. Refreshments will be available for purchase.',
    },
    eventMetadata: {
      '1': {
        location: 'UNBC Gymnasium',
        organization: 'Athletics Department',
        category: 'sports',
        cost: '$5 entry fee for participants',
        registrationRequired: true,
        website: 'https://example.com/basketball',
      },
    },
    showCost: true,
  },
};

export const MinimalInfo: Story = {
  args: {
    event: {
      ...sampleEvent,
      title: 'Study Session',
      description: '',
    },
    eventMetadata: {
      '1': {
        location: 'Library',
        category: 'unbc',
      },
    },
    showCost: true,
  },
};
