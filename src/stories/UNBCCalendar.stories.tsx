import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import UNBCCalendar from '@/components/unbc-calendar';

const meta: Meta<typeof UNBCCalendar> = {
  title: 'UNBC/Calendar/UNBCCalendar',
  component: UNBCCalendar,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-background text-foreground p-6">
        <div
          className="max-w-6xl mx-auto unbc-calendar-container"
          data-list-initial-items="30"
          data-list-load-more-count="15"
          data-month-display-mode="popover"
          data-month-sidebar-position="right"
        >
          <Story />
        </div>
      </div>
    ),
  ],
  argTypes: {
    initialView: {
      control: 'select',
      options: ['month', 'week', 'day', 'list'],
    },
    eventSortOrder: {
      control: 'inline-radio',
      options: ['asc', 'desc'],
    },
    initialMonthDisplayMode: {
      control: 'inline-radio',
      options: ['popover', 'dropdown', 'sidebar'],
    },
    initialMonthSidebarPosition: {
      control: 'inline-radio',
      options: ['left', 'right'],
    },
  },
  args: {
    initialView: 'month',
    initialCategoryFilter: 'all',
    initialOrganizationFilter: 'all',
    showWeekView: true,
    showDayView: true,
    showCost: true,
    eventSortOrder: 'asc',
    initialMonthDisplayMode: 'popover',
    initialMonthSidebarPosition: 'right',
  },
};

export default meta;
type Story = StoryObj<typeof UNBCCalendar>;

export const Default: Story = {};

export const SidebarMonth: Story = {
  args: {
    initialMonthDisplayMode: 'sidebar',
    initialMonthSidebarPosition: 'left',
  },
};

export const CompactList: Story = {
  args: {
    initialView: 'list',
    showWeekView: false,
    showDayView: false,
  },
};

export const MobileView: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    layout: 'fullscreen',
    chromatic: { viewports: [375] },
  },
  args: {
    initialView: 'month',
    showWeekView: false,
    showDayView: true,
  },
  decorators: [
    (Story) => (
      <>
        <style>
          {`
            /* Force mobile calendar view ONLY for mobile-story-wrapper */
            @media (min-width: 768px) {
              /* Hide all desktop-only elements (hidden on mobile, shown on md+) */
              .mobile-story-wrapper .unbc-calendar-view .hidden.md\\:block {
                display: none !important;
              }

              /* Show all mobile-only elements (shown on mobile, hidden on md+) */
              .mobile-story-wrapper .unbc-calendar-view .md\\:hidden {
                display: block !important;
              }

              /* Specifically show mobile calendar */
              .mobile-story-wrapper .unbc-calendar-view .mobile-calendar {
                display: block !important;
              }
            }
          `}
        </style>
        <div className="mobile-story-wrapper min-h-screen bg-background text-foreground p-4" style={{ maxWidth: '414px', margin: '0 auto' }}>
          <div
            className="w-full unbc-calendar-container"
            data-list-initial-items="30"
            data-list-load-more-count="15"
            data-month-display-mode="popover"
            data-month-sidebar-position="right"
          >
            <Story />
          </div>
        </div>
      </>
    ),
  ],
};
