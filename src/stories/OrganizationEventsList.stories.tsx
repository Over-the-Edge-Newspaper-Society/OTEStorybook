import type { Meta, StoryObj } from '@storybook/react';
import { OrganizationEventsList } from '@/components/organization-events-list';
import { unbcEvents, eventMetadata } from '@/data/events';
import type { CategoryVariant } from '@/utils/categoryColors';

const categoryMappings = {
  academic: 'primary',
  social: 'success',
  sports: 'warning',
  workshop: 'danger',
  cultural: 'orange',
} satisfies Record<string, CategoryVariant>;

const meta: Meta<typeof OrganizationEventsList> = {
  title: 'UNBC/Calendar/OrganizationEventsList',
  component: OrganizationEventsList,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-background text-foreground p-6">
        <div className="max-w-4xl mx-auto">
          <Story />
        </div>
      </div>
    ),
  ],
  args: {
    events: unbcEvents,
    eventMetadata,
    categoryMappings,
    organizationName: 'Student Union',
    showPastEvents: false,
  },
  argTypes: {
    events: { control: false },
    eventMetadata: { control: false },
    categoryMappings: { control: false },
  },
};

export default meta;
type Story = StoryObj<typeof OrganizationEventsList>;

export const Default: Story = {};

export const AthleticsDepartment: Story = {
  args: {
    organizationName: 'Athletics Department',
  },
};

export const IncludePastEvents: Story = {
  args: {
    organizationName: 'Computer Science Club',
    showPastEvents: true,
    limit: 6,
  },
};
