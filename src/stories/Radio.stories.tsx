import type { Meta, StoryObj } from '@storybook/react';
import type { ReactNode } from 'react';

import { RadioPlayer } from '@/components/radio/radio-player';

const meta: Meta<typeof RadioPlayer> = {
  title: 'UNBC/Radio',
  component: RadioPlayer,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof RadioPlayer>;

const StoryCanvas = ({ children }: { children: ReactNode }) => (
  <div className="min-h-screen w-full bg-gradient-to-b from-background to-background/70 py-12">
    <div className="mx-auto max-w-5xl">{children}</div>
  </div>
);

export const Locked: Story = {
  render: (args) => (
    <StoryCanvas>
      <RadioPlayer {...args} />
    </StoryCanvas>
  ),
};

export const Unlocked: Story = {
  args: {
    defaultLocked: false,
  },
  render: (args) => (
    <StoryCanvas>
      <RadioPlayer {...args} />
    </StoryCanvas>
  ),
};
