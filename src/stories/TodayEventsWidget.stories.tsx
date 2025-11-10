import type { Meta, StoryObj } from '@storybook/react';
import { TodayEventsWidget } from '@/components/today-events-widget';

const meta: Meta<typeof TodayEventsWidget> = {
  title: 'UNBC/Calendar/TodayEventsWidget',
  component: TodayEventsWidget,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-background text-foreground p-6">
        <div className="max-w-xl mx-auto">
          <Story />
        </div>
      </div>
    ),
  ],
  args: {
    title: "Today's Events",
    maxEvents: 10,
  },
};

export default meta;
type Story = StoryObj<typeof TodayEventsWidget>;

export const Default: Story = {};

export const FiveEvents: Story = {
  args: {
    maxEvents: 5,
  },
};

export const CustomTitle: Story = {
  args: {
    title: 'Clubs On Campus Today',
    maxEvents: 6,
  },
};
